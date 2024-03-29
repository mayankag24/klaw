import useFeatureFlag from "src/services/feature-flags/hook/useFeatureFlag";
import { renderHook } from "@testing-library/react";
import { FeatureFlag } from "src/services/feature-flags/types";

const isFeatureFlagActiveMock = jest.fn();

jest.mock("src/services/feature-flags/utils", () => ({
  isFeatureFlagActive: () => isFeatureFlagActiveMock(),
}));

// this avoids having to add a flag that is only used
// for testing purpose to our FeatureFlag enum
const TEST_FEATURE_FLAG = "TEST_FEATURE_FLAG" as unknown as FeatureFlag;

describe("useFeatureFlag", () => {
  describe('when flag is defined in process Environment with value "false"', () => {
    beforeAll(() => {
      isFeatureFlagActiveMock.mockReturnValue(false);
    });
    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("returns false", async () => {
      const {
        result: { current: value },
      } = await renderHook(() => useFeatureFlag(TEST_FEATURE_FLAG));
      expect(value).toBe(false);
    });
  });
  describe('when flag is defined in process Environment with value "true"', () => {
    beforeAll(() => {
      isFeatureFlagActiveMock.mockReturnValue(true);
    });
    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("returns true", async () => {
      const {
        result: { current: value },
      } = await renderHook(() => useFeatureFlag(TEST_FEATURE_FLAG));
      expect(value).toBe(true);
    });
  });
});
