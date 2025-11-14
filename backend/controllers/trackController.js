import Track from "../models/Track.js";

export const getTracks = async (req, res) => {
  const tracks = await Track.find();
  res.json(tracks);
};

export const addTrack = async (req, res) => {
  const newTrack = new Track(req.body);
  await newTrack.save();
  res.status(201).json({ message: "Track added", track: newTrack });
};
