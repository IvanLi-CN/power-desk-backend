export function deserializeTemperature(message: Buffer) {
  return new DataView(message.buffer).getFloat32(message.byteOffset, true);
}

export function deserializeVoltageInMillivolts(message: Buffer) {
  return new DataView(message.buffer).getFloat64(message.byteOffset, true);
}

export function deserializePowerInWatts(message: Buffer) {
  return new DataView(message.buffer).getFloat64(message.byteOffset, true);
}

export function deserializeCurrentInAmperes(message: Buffer) {
  const value = new DataView(message.buffer).getFloat64(
    message.byteOffset,
    true,
  );
  return Math.max(value, 0);
}

export function deserializeOutVoltageInMillivolts(message: Buffer) {
  return new DataView(message.buffer).getUint16(message.byteOffset, true);
}

export function deserializeOutCurrentInMilliAmperes(message: Buffer) {
  return new DataView(message.buffer).getFloat32(message.byteOffset, true);
}

export function deserializeOutPowerInWatts(message: Buffer) {
  return new DataView(message.buffer).getUint16(message.byteOffset, true);
}
export function deserializeLimitPowerInWatts(message: Buffer) {
  return new DataView(message.buffer).getUint8(message.byteOffset);
}

export function deserializeOutputLimitCurrentInMilliamps(message: Buffer) {
  return new DataView(message.buffer).getUint16(message.byteOffset, true);
}

