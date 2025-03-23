import React, { useState } from "react";
import zxcvbn from "zxcvbn"; // For password strength evaluation
import { motion } from "framer-motion"; // For animations
// import queryString from "query-string"; // For sharing passwords
import "./index.css";

function App() {
  const [phrase, setPhrase] = useState("");
  const [passwords, setPasswords] = useState([]);
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecialChars, setIncludeSpecialChars] = useState(true);
  // const [darkMode, setDarkMode] = useState(false);
  const [passwordHistory, setPasswordHistory] = useState([]);

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

    const newPasswords = [];
    for (let i = 0; i < 12; i++) {
      newPasswords.push(createPassword(phrase));
    }
    setPasswords(newPasswords);
    setPasswordHistory([...passwordHistory, ...newPasswords]);
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
    while (cleanedPhrase.length < passwordLength) {
      const randomCharType = Math.floor(Math.random() * 4); // 0: uppercase, 1: lowercase, 2: number, 3: special
      switch (randomCharType) {
        case 0:
          if (includeUppercase) cleanedPhrase += getRandomChar(uppercaseLetters);
          break;
        case 1:
          if (includeLowercase) cleanedPhrase += getRandomChar(lowercaseLetters);
          break;
        case 2:
          if (includeNumbers) cleanedPhrase += getRandomChar(numbers);
          break;
        case 3:
          if (includeSpecialChars) cleanedPhrase += getRandomChar(specialChars);
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
    const randomUpper = includeUppercase ? getRandomChar(uppercaseLetters) : "";
    const randomLower = includeLowercase ? getRandomChar(lowercaseLetters) : "";
    const randomNumber = includeNumbers ? getRandomChar(numbers) : "";
    const randomSpecial = includeSpecialChars ? getRandomChar(specialChars) : "";

    // Combine everything
    let password =
      shuffledPhrase + randomUpper + randomLower + randomNumber + randomSpecial;

    // Shuffle again to randomize the order
    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    // Ensure the password is at least 12 characters
    return password.slice(0, passwordLength);
  };

  // Function to copy password to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Password copied to clipboard!");
    });
  };

  // Function to regenerate a single password
  const regeneratePassword = (index) => {
    const newPasswords = [...passwords];
    newPasswords[index] = createPassword(phrase);
    setPasswords(newPasswords);
  };

  // Function to save password to local storage
  const savePassword = (password) => {
    const savedPasswords = JSON.parse(localStorage.getItem("savedPasswords")) || [];
    savedPasswords.push(password);
    localStorage.setItem("savedPasswords", JSON.stringify(savedPasswords));
    alert("Password saved!");
  };

  // Function to share passwords via a link
  // const sharePasswords = () => {
  //   const encodedPasswords = queryString.stringify({ passwords });
  //   const shareLink = `${window.location.origin}?${encodedPasswords}`;
  //   navigator.clipboard.writeText(shareLink).then(() => {
  //     alert("Share link copied to clipboard!");
  //   });
  // };

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
    <div className=''>
    {/* <div className={`${darkMode ? "dark" : ""}`}> */}
      <div className="min-h-screen bg-zinc-100 p-4">
        {/* <button
          onClick={() => setDarkMode(!darkMode)}
          className="fixed top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button> */}

        <h1 className="text-emerald-900 text-3xl font-bold mb-6">
          Password Generator
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 items-center px-3.5 gap-4 m-8">
          
          <div className="flex flex-col items-center mb-4">
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
          </div>

          <div className="flex flex-col items-center mb-4">
            <div className="flex flex-col items-start ">
              <label className="mb-2">
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={() => setIncludeUppercase(!includeUppercase)}
                  className="me-2"
                />
                Include Uppercase Letters
              </label>
              <label className="mb-2">
                <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={() => setIncludeLowercase(!includeLowercase)}
                  className="me-2"
                />
                Include Lowercase Letters
              </label>
              <label className="mb-2">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={() => setIncludeNumbers(!includeNumbers)}
                  className="me-2"
                />
                Include Numbers
              </label>
              <label className="mb-2">
                <input
                  type="checkbox"
                  checked={includeSpecialChars}
                  onChange={() => setIncludeSpecialChars(!includeSpecialChars)}
                  className="me-2"
                />
                Include Special Characters
              </label>
              <label className="text-emerald-900 ">
                Password Length: {passwordLength}
              </label>
              <input
                type="range"
                min="12"
                max="32"
                value={passwordLength}
                onChange={(e) => setPasswordLength(Number(e.target.value))}
                className="w-80"
              />
            </div>

            <div className="flex flex-col items-start mb-4">
              
            </div>
          </div>

        </div>
        
        <div className="px-24 lg:px-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {passwords.map((password, index) => {
            const strength = getPasswordStrength(password);
            const strengthText = getStrengthText(strength);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm text-center"
              >
                <div className="font-mono text-md mb-2">{password}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full ${
                      strength < 2
                        ? "bg-red-500"
                        : strength < 4
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${(strength + 1) * 20}%` }}
                  ></div>
                </div>
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
                  <button
                    onClick={() => regeneratePassword(index)}
                    className="text-blue-500 hover:text-blue-600 focus:outline-none ml-2"
                  >
                    Regenerate
                  </button>
                  <button
                    onClick={() => savePassword(password)}
                    className="text-gray-500 hover:text-gray-600 focus:outline-none ml-2"
                  >
                    Save
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* <div className="flex flex-col items-center mb-4">
          <button
            onClick={sharePasswords}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg mt-4"
          >
            Share Passwords
          </button>
        </div> */}

        <div className="mt-4">
          <h2 className="text-emerald-900 text-2xl font-bold mb-4">
            Password History
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {passwordHistory.map((password, index) => (
              <div
                key={index}
                className="p-4 bg-white border border-zinc-200 rounded-3xl shadow-sm text-center"
              >
                <div className="font-mono text-lg mb-2">{password}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
// import React, { useState } from "react";
// import zxcvbn from "zxcvbn"; // For password strength evaluation
// import './index.css';

// function App() {
//   const [phrase, setPhrase] = useState("");
//   const [passwords, setPasswords] = useState([]);

//   // Cryptographically secure random character generator
//   const getRandomChar = (chars) => {
//     const randomValues = new Uint32Array(1);
//     window.crypto.getRandomValues(randomValues);
//     return chars[randomValues[0] % chars.length];
//   };

//   // Function to generate passwords
//   const generatePasswords = () => {
//     if (phrase.trim().length < 1) {
//       alert("Kindly please enter a phrase!");
//       return;
//     }

//     const passwords = [];
//     for (let i = 0; i < 12; i++) {
//       passwords.push(createPassword(phrase));
//     }
//     setPasswords(passwords);
//   };

//   // Function to create a single password
//   const createPassword = (phrase) => {
//     const specialChars = "!@#$%^&*()_+";
//     const numbers = "0123456789";
//     const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//     const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";

//     // Remove spaces from the phrase
//     let cleanedPhrase = phrase.replace(/\s/g, "");

//     // If the phrase is too short, pad it with random characters
//     while (cleanedPhrase.length < 12) {
//       const randomCharType = Math.floor(Math.random() * 4); // 0: uppercase, 1: lowercase, 2: number, 3: special
//       switch (randomCharType) {
//         case 0:
//           cleanedPhrase += getRandomChar(uppercaseLetters);
//           break;
//         case 1:
//           cleanedPhrase += getRandomChar(lowercaseLetters);
//           break;
//         case 2:
//           cleanedPhrase += getRandomChar(numbers);
//           break;
//         case 3:
//           cleanedPhrase += getRandomChar(specialChars);
//           break;
//         default:
//           break;
//       }
//     }

//     // Shuffle the phrase and add random characters
//     let shuffledPhrase = cleanedPhrase
//       .split("")
//       .sort(() => Math.random() - 0.5)
//       .join("");

//     // Ensure at least one uppercase, lowercase, number, and special character
//     const randomUpper = getRandomChar(uppercaseLetters);
//     const randomLower = getRandomChar(lowercaseLetters);
//     const randomNumber = getRandomChar(numbers);
//     const randomSpecial = getRandomChar(specialChars);

//     // Combine everything
//     let password =
//       shuffledPhrase + randomUpper + randomLower + randomNumber + randomSpecial;

//     // Shuffle again to randomize the order
//     password = password
//       .split("")
//       .sort(() => Math.random() - 0.5)
//       .join("");

//     // Ensure the password is at least 12 characters
//     return password.slice(0, 12); // Trim to 12 characters
//   };

//   // Function to copy password to clipboard
//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text).then(() => {
//       alert("Password copied to clipboard!");
//     });
//   };

//   // Function to get password strength
//   const getPasswordStrength = (password) => {
//     const result = zxcvbn(password);
//     return result.score; // Returns a score from 0 (weak) to 4 (strong)
//   };

//   // Function to display strength as text
//   const getStrengthText = (score) => {
//     switch (score) {
//       case 0:
//         return "Very Weak";
//       case 1:
//         return "Weak";
//       case 2:
//         return "Medium";
//       case 3:
//         return "Strong";
//       case 4:
//         return "Very Strong";
//       default:
//         return "Unknown";
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-emerald-100 p-4">
//       <h1 className="text-emerald-900 text-3xl font-bold mb-6">Password Generator</h1>
//       <input
//         type="text"
//         placeholder="Enter your favorite phrase"
//         value={phrase}
//         onChange={(e) => setPhrase(e.target.value)}
//         className="w-80 p-2 mb-4 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
//       />
//       <button
//         onClick={generatePasswords}
//         className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
//       >
//         Generate Passwords
//       </button>

//       <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-4">
//         {passwords.map((password, index) => {
//           const strength = getPasswordStrength(password);
//           const strengthText = getStrengthText(strength);
//           return (
//             <div
//               key={index}
//               className="p-4 bg-white border border-zinc-200 rounded-3xl shadow-sm text-center"
//             >
//               <div className="font-mono text-lg mb-2">{password}</div>
//               <div className="flex items-center justify-between">
//                 <span
//                   className={`text-sm font-semibold ${
//                     strength < 2
//                       ? "text-red-500"
//                       : strength < 4
//                       ? "text-yellow-500"
//                       : "text-green-500"
//                   }`}
//                 >
//                   {strengthText}
//                 </span>
//                 <button
//                   onClick={() => copyToClipboard(password)}
//                   className="text-purple-500 hover:text-purple-600 focus:outline-none"
//                 >
//                   Copy
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default App;
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
