import "@testing-library/jest-native/extend-expect";

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper", () => ({
  API: {
    AnimatedModuleType: jest.fn(),
    addAnimatedEventToView: jest.fn(),
    connectAnimatedNodes: jest.fn(),
    connectAnimatedNodeToView: jest.fn(),
    createAnimatedNode: jest.fn(),
    disconnectAnimatedNodeFromView: jest.fn(),
    disconnectAnimatedNodes: jest.fn(),
    dropAnimatedNode: jest.fn(),
    extractAnimatedNodeOffset: jest.fn(),
    flattenAnimatedNodeOffset: jest.fn(),
    removeAnimatedEventFromView: jest.fn(),
    restoreDefaultValues: jest.fn(),
    setAnimatedNodeOffset: jest.fn(),
    setAnimatedNodeValue: jest.fn(),
    startAnimatingNode: jest.fn(),
    startListeningToAnimatedNodeValue: jest.fn(),
    stopAnimation: jest.fn(),
    stopListeningToAnimatedNodeValue: jest.fn(),
  },
  addListener: jest.fn(),
  removeAllListeners: jest.fn(),
  removeListeners: jest.fn(),
}), { virtual: true });