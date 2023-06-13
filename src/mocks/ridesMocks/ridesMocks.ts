import {
  SurfaceTypeOptions,
  type RideDataStructure,
  type RidesDataStructure,
  DifficultyOption,
} from "../../server/controllers/ridesControllers/types/types";

export const mockGravelRide: RideDataStructure = {
  title: "Ruta de montaña A",
  location: "Montaña X",
  date: "2023-06-14T00:00:00.000Z",
  surfaceType: SurfaceTypeOptions.Gravel,
  distance: 20,
  difficulty: DifficultyOption.Easy,
  pace: 3,
  description: "Únete a nosotros para un recorrido escénico por el campo.",
  ridersJoined: ["644a55c116f442c7541666da", "644a55c116f442c7541666db"],
  ridersLimit: 10,
  image: "ruta1.jpg",
  owner: "64804b1505ab892cb07b0061",
};

export const mockMountainRide: RideDataStructure = {
  title: "Ruta de montaña B",
  location: "Montaña Y",
  date: "2023-06-14T00:00:00.000Z",
  surfaceType: SurfaceTypeOptions.Mtb,
  distance: 20,
  difficulty: DifficultyOption.Easy,
  pace: 3,
  description: "Únete a nosotros para un recorrido escénico por el campo.",
  ridersJoined: ["644a55c116f442c7541666da", "644a55c116f442c7541666db"],
  ridersLimit: 10,
  image: "ruta1.jpg",
  owner: "64804b1505ab892cb07b0061",
};

export const mockRides: RidesDataStructure = [mockMountainRide, mockGravelRide];
