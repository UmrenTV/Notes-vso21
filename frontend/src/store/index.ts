import { createStore } from "vuex";

interface State {
  sessionId: string | null;
}

const store = createStore<State>({
  state: {
    sessionId: null,
  },
  mutations: {
    setSessionId(state, sessionId: string) {
      state.sessionId = sessionId;
    },
    clearSessionId(state) {
      state.sessionId = null;
    },
  },
  actions: {
    removeSessionId({ commit }) {
      commit("clearSessionId");
    },
  },
  getters: {
    getSessionId: (state) => state.sessionId,
  },
});

export default store;
