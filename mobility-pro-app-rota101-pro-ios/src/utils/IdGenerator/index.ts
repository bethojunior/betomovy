export default class IdGenerator {
  static basic(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  }

  static short(): string {
    return (
      Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
    );
  }

  static uuidLike(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
      const r = (Math.random() * 16) | 0;
      const v = char === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
