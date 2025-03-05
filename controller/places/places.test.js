import { getValidatedPlace } from "./places.js"; // update the path as needed
import { jest } from "@jest/globals";
import { configDotenv } from "dotenv";
configDotenv();

describe("getValidatedPlace", () => {
  let req;
  let res;

  beforeEach(() => {
    // Create a fresh mock request and response for each test.
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  it("should return 400 if no place is provided", async () => {
    // No place provided in the query.
    await getValidatedPlace(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ err: "no place was provided." });
  });

  it("should return 200 with validated place data when a valid place is provided", async () => {
    req.query.place = "Paris";
    // This test assumes that for "Paris" the external API calls will generate a valid description
    // and extractValidatePlaces will return a non-empty places array.
    await getValidatedPlace(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    // The response should contain the validated place information.
    expect(res.send).toHaveBeenCalled();
  });
});
