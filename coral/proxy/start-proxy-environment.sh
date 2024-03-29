#!/bin/bash

DOCKER_FLAG=""
MODE=""
TEST_ENV=false
VERBOSE=false

check_port() {
  echo -e '\n\n🔎 Checking ports...'
  local port="$1"
  local name="$2"

  local status_code
  #  cluster-api returns a 403 and core a 302 when users are not signed in while checking
  status_code=$(curl -o /dev/null -s -w "%{http_code}" http://localhost:"$port")

  if [ "$status_code" = "200" ] || [ "$status_code" = "403" ] || [ "$status_code" = "302" ]; then
    echo -e "✅ Klaw $name is already running on localhost:$port"
  else
    echo -e "ℹ️Klaw $name is not running on localhost:$port, will start docker."
    return 1
  fi
}

parseArguments() {
  for arg in "$@"; do
    case $arg in
    -m=* | --mode=*)
      MODE="${arg#*=}"
      shift
      ;;
    -t==true* | --testEnv=true*)
      TEST_ENV="${arg#*=}"
      shift
      ;;
    -v | --verbose)
      VERBOSE="true"
      shift
      ;;
    esac
  done
}


checkDockerMode() {
  if [ "$MODE" = "start" ]; then
    DOCKER_FLAG="--dev-env"
  elif [ "$MODE" = "restart" ]; then # if -a=null
    DOCKER_FLAG="--dev-env-deploy"
  elif [ "$MODE" = "stop" ]; then # if -a=null
    DOCKER_FLAG="--stop"
  elif [ "$MODE" = "destroy" ]; then # if -a=null
    DOCKER_FLAG="--destroy"
  else
    echo -e "\n\n⚠️ Please set a flag for mode:"
    echo "- --mode=start for build and deploy"
    echo "- --mode=restart for deploy"
    echo "- --mode=stop for stopping containers"
    echo "- --mode=destroy for stopping and removing containers"
    echo -e "\n"
    exit 1
fi
}

startDocker() {
  DOCKER_COMMAND="docker-scripts/klaw-docker.sh"
  DOCKER_TEST_ENV_FLAG="--dev-kafka-env"

  if [ "$DOCKER_FLAG" = --destroy ]; then
    sh ../../$DOCKER_COMMAND $DOCKER_FLAG
    exit 0
  fi

  if [ "$DOCKER_FLAG" = --stop ]; then
    sh ../../$DOCKER_COMMAND $DOCKER_FLAG
    exit 0
  fi


  # Check if core is running on localhost:9097
  check_port 9097 "core" || {
    sh ../../$DOCKER_COMMAND $DOCKER_FLAG
  }

  # Check if cluster-api is running on localhost:9343
  check_port 9343 "cluster-api" || {
    sh ../../$DOCKER_COMMAND $DOCKER_FLAG
  }

  if [ "$TEST_ENV" = true ]; then
    # Check if zookeeper is running on localhost:2181
    check_port 2181 "zookeeper" || {
      sh ../../$DOCKER_COMMAND $DOCKER_TEST_ENV_FLAG
    }

    # Check if klaw-kafka is running on localhost:9092
    check_port 9092 "klaw-kafka" || {
      sh ../../$DOCKER_COMMAND $DOCKER_TEST_ENV_FLAG
    }

    # Check if klaw-schema-registry is running on localhost:8081
    check_port 8081 "klaw-schema-registry" || {
      sh ../../$DOCKER_COMMAND $DOCKER_TEST_ENV_FLAG
    }
  fi
}

startProxyServer() {
  echo -e "\n\n 🎬 Starting proxy server..."

  if [ "$VERBOSE" = true ]; then
    VERBOSE=true npm-run-all -l -p _internal_use_proxy _internal_use_start-coral
  else
    pnpm npm-run-all -l -p _internal_use_proxy _internal_use_start-coral
  fi
}

parseArguments "$@"
checkDockerMode
startDocker
startProxyServer