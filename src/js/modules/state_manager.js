
class StateManager {
  constructor () {
    this.state = {}
  }

  setState (key, val) {
    this.state[key] = val
  }

  getState (key) {
    if (key in this.state) {
      return this.state[key]
    } else {
      return null
    }
  }
}

export default StateManager
