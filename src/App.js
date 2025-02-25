import React, { useState } from "react";
import zxcvbn from "zxcvbn"; // For password strength evaluation
import './index.css';

function App() {
  const [phrase, setPhrase] = useState("");
  const [passwords, setPasswords] = useState([]);

  // Cryptographically secure random character generator
  const getRandomChar = (chars) => {
    const randomValues = new Uint32Array(1);
    window.crypto.getRandomValues(randomValues);
    return chars[randomValues[0] % chars.length];
  };

  // Function to generate passwords
  const generatePasswords = () => {
    if (phrase.trim().length < 1) {
      alert("Kindly please enter a phrase!");
      return;
    }

    const passwords = [];
    for (let i = 0; i < 12; i++) {
      passwords.push(createPassword(phrase));
    }
    setPasswords(passwords);
  };

  // Function to create a single password
  const createPassword = (phrase) => {
    const specialChars = "!@#$%^&*()_+";
    const numbers = "0123456789";
    const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";

    // Remove spaces from the phrase
    let cleanedPhrase = phrase.replace(/\s/g, "");

    // If the phrase is too short, pad it with random characters
    while (cleanedPhrase.length < 12) {
      const randomCharType = Math.floor(Math.random() * 4); // 0: uppercase, 1: lowercase, 2: number, 3: special
      switch (randomCharType) {
        case 0:
          cleanedPhrase += getRandomChar(uppercaseLetters);
          break;
        case 1:
          cleanedPhrase += getRandomChar(lowercaseLetters);
          break;
        case 2:
          cleanedPhrase += getRandomChar(numbers);
          break;
        case 3:
          cleanedPhrase += getRandomChar(specialChars);
          break;
        default:
          break;
      }
    }

    // Shuffle the phrase and add random characters
    let shuffledPhrase = cleanedPhrase
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    // Ensure at least one uppercase, lowercase, number, and special character
    const randomUpper = getRandomChar(uppercaseLetters);
    const randomLower = getRandomChar(lowercaseLetters);
    const randomNumber = getRandomChar(numbers);
    const randomSpecial = getRandomChar(specialChars);

    // Combine everything
    let password =
      shuffledPhrase + randomUpper + randomLower + randomNumber + randomSpecial;

    // Shuffle again to randomize the order
    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    // Ensure the password is at least 12 characters
    return password.slice(0, 12); // Trim to 12 characters
  };

  // Function to copy password to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Password copied to clipboard!");
    });
  };

  // Function to get password strength
  const getPasswordStrength = (password) => {
    const result = zxcvbn(password);
    return result.score; // Returns a score from 0 (weak) to 4 (strong)
  };

  // Function to display strength as text
  const getStrengthText = (score) => {
    switch (score) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Medium";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-emerald-100 p-4">
      <h1 className="text-emerald-900 text-3xl font-bold mb-6">Password Generator</h1>
      <input
        type="text"
        placeholder="Enter your favorite phrase"
        value={phrase}
        onChange={(e) => setPhrase(e.target.value)}
        className="w-80 p-2 mb-4 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <button
        onClick={generatePasswords}
        className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        Generate Passwords
      </button>

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-4">
        {passwords.map((password, index) => {
          const strength = getPasswordStrength(password);
          const strengthText = getStrengthText(strength);
          return (
            <div
              key={index}
              className="p-4 bg-white border border-zinc-200 rounded-3xl shadow-sm text-center"
            >
              <div className="font-mono text-lg mb-2">{password}</div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-semibold ${
                    strength < 2
                      ? "text-red-500"
                      : strength < 4
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  {strengthText}
                </span>
                <button
                  onClick={() => copyToClipboard(password)}
                  className="text-purple-500 hover:text-purple-600 focus:outline-none"
                >
                  Copy
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
