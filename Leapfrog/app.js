const mappingTable = {
    'ONE': 1, 'TWO': 2, 'THREE': 3, 'FOUR': 4,
    'FIVE': 5, 'SIX': 6, 'SEVEN': 7, 'EIGHT': 8,
    'NINE': 9, 'TEN': 10
};
const sound = new Audio("https://assets.mixkit.co/active_storage/sfx/3005/3005-preview.mp3");

const lilypads = [
    document.getElementById("lilypad-1"),
    document.getElementById("lilypad-2"),
    document.getElementById("lilypad-3"),
    document.getElementById("lilypad-4"),
    document.getElementById("lilypad-5"),
    document.getElementById("lilypad-6"),
    document.getElementById("lilypad-7"),
    document.getElementById("lilypad-8"),
    document.getElementById("lilypad-9"),
    document.getElementById("lilypad-10"),
];

function isLilypadOccupied(lilypad) {
  return lilypad.dataset.occupied === 'true';
}

function setLilypadOccupied(lilypad, occupied) {
  lilypad.dataset.occupied = occupied ? 'true' : 'false';
}

dragula([
  document.getElementById("land"),
  ...lilypads
], {
  accepts: function (el, target, source, sibling) {
    // Only allow one frog per lilypad
    return target.id === 'land' || (!isLilypadOccupied(target) && target.classList.contains('lilypad'));
  }
})
.on('drop', function (el, target, source, sibling) {
  if (target.classList.contains('lilypad')) {
    setLilypadOccupied(target, true);  // Mark the lilypad as occupied
    const frogNumberWord = el.querySelector('.displayWord').textContent.trim();
    const lilypadNumber = target.querySelector('.displayNum').textContent.trim();

    if (mappingTable[frogNumberWord] == lilypadNumber) {
      // Update score, play sound, etc.
        updateScore(10);
        sound.play();
    }  
  } else if (source.classList.contains('lilypad')) {
    setLilypadOccupied(source, false);  // If the frog is moved off a lilypad, mark the lilypad as unoccupied
  }
});
// Add the touchmove event listener after initializing Dragula
document.getElementById('land').addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

// Helper function to update the score
function updateScore(amount) {
    const scoreboard = document.querySelector('.scoreboard span');
    const currentScore = parseInt(scoreboard.textContent, 10);
    scoreboard.textContent = currentScore + amount;
}
