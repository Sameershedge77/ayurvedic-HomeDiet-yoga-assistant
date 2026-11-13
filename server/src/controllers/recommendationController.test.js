import { jest } from "@jest/globals";

const query = jest.fn();
const analyzeHealthProfile = jest.fn();
const getRetrievalContext = jest.fn();
const generateRecommendations = jest.fn();

jest.unstable_mockModule("../config/db.js", () => ({
  default: {
    promise: () => ({ query })
  }
}));

jest.unstable_mockModule("../services/aiService.js", () => ({
  analyzeHealthProfile
}));

jest.unstable_mockModule("../services/recommendationService.js", () => ({
  getRetrievalContext,
  normalizeKey: (value) => value.toLowerCase(),
  generateRecommendations
}));

const { getRecommendations } = await import("./recommendationController.js");

describe("getRecommendations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    query.mockResolvedValue([[]]);
    getRetrievalContext.mockResolvedValue({ yoga: [], remedies: [] });
    analyzeHealthProfile.mockRejectedValue(new Error("provider unavailable"));
    generateRecommendations.mockResolvedValue({
      source: "STATIC_MAPPING",
      summary: "A curated plan",
      recommendations: {
        yoga: [{ name: "Gentle pose" }],
        remedies: [{ name: "Simple remedy" }]
      }
    });
  });

  it("uses curated recommendations when AI providers fail", async () => {
    const req = {
      body: {
        userId: 7,
        healthIssues: ["back pain"],
        prakriti_primary: "vata",
        prakriti_secondary: "pitta",
        vikriti: { vata_pct: 55, pitta_pct: 30, kapha_pct: 15 }
      }
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    const consoleWarn = jest.spyOn(console, "warn").mockImplementation(() => {});

    await getRecommendations(req, res);

    expect(generateRecommendations).toHaveBeenCalledWith({
      ...req.body,
      mode: "static"
    });
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      recommendations: expect.objectContaining({
        summary: "A curated plan"
      }),
      source: "STATIC_MAPPING"
    });
    expect(query).toHaveBeenCalledTimes(1);

    consoleError.mockRestore();
    consoleWarn.mockRestore();
  });
});
