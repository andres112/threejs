import { PositionalAudio, AudioListener, AudioLoader } from 'three';

export const createAudioListener = () => {
  const listener = new AudioListener();
  return listener;
};

export const createPositionalAudio = (listener: AudioListener, audio: string) => {
  const sound = new PositionalAudio(listener);
  const audioLoader = new AudioLoader();
  audioLoader.load(audio, (buffer) => {
    sound.setBuffer(buffer);
    sound.setRefDistance(1);
    sound.setLoop(true);
    sound.setVolume(1);
  });
  return sound;
};

export const playSound = (sound: PositionalAudio) => {
  sound.play();
};
