// Mengurangi energi. Mengembalikan true bila energi habis (karakter pingsan).
export function spend(state, cost) {
  state.energy = Math.max(0, state.energy - cost);
  return state.energy === 0;
}
