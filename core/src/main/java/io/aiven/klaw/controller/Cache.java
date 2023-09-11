package io.aiven.klaw.controller;

import io.aiven.klaw.config.ManageDatabase;
import io.aiven.klaw.dao.Env;
import io.aiven.klaw.dao.Team;
import io.aiven.klaw.model.ApiResponse;
import io.aiven.klaw.model.enums.*;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cache")
@Slf4j
public class Cache {

  @Autowired ManageDatabase manageDatabase;

  @PostMapping(
      value = "/environment/tenant/{tenantId}/id/{id}",
      produces = {MediaType.APPLICATION_JSON_VALUE},
      consumes = {MediaType.APPLICATION_JSON_VALUE})
  public ResponseEntity<ApiResponse> addEnvToCache(
      @PathVariable("tenantId") Integer tenantId,
      @PathVariable("id") Integer id,
      @Valid @RequestBody Env env) {
    manageDatabase.addEnvToCache(tenantId, env, true);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @DeleteMapping(
      value = "/environment/tenant/{tenantId}/id/{id}",
      produces = {MediaType.APPLICATION_JSON_VALUE},
      consumes = {MediaType.APPLICATION_JSON_VALUE})
  public ResponseEntity<ApiResponse> removeEnvFromCache(
      @PathVariable("tenantId") Integer tenantId, @PathVariable("id") Integer id) {
    manageDatabase.removeEnvFromCache(tenantId, id, true);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @PostMapping(
      value = "/team/tenant/{tenantId}/id/{id}",
      produces = {MediaType.APPLICATION_JSON_VALUE},
      consumes = {MediaType.APPLICATION_JSON_VALUE})
  public ResponseEntity<ApiResponse> addTeamToCache(
      @PathVariable("tenantId") Integer tenantId,
      @PathVariable("id") Integer id,
      @Valid @RequestBody Team team) {
    manageDatabase.addTeamToCache(tenantId, team, true);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @DeleteMapping(
      value = "/team/tenant/{tenantId}/id/{id}",
      produces = {MediaType.APPLICATION_JSON_VALUE},
      consumes = {MediaType.APPLICATION_JSON_VALUE})
  public ResponseEntity<ApiResponse> removeTeamFromCache(
      @PathVariable("tenantId") Integer tenantId, @PathVariable("id") Integer id) {
    manageDatabase.removeTeamFromCache(tenantId, id, true);
    return new ResponseEntity<>(HttpStatus.OK);
  }
}
