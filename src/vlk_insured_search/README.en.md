# VLK Insured Search
[![RU](https://img.shields.io/badge/lang-RU-lightgrey)](README.md) [![EN](https://img.shields.io/badge/lang-EN-blue)](#) [![LT](https://img.shields.io/badge/lang-LT-lightgrey)](README.lt.md) [![Back](https://img.shields.io/badge/Back-List-black)](../../README.en.md)

[![Install](https://img.shields.io/badge/Install-Direct-brightgreen)](vlk_insured_search.user.js?raw=1)

Adds a single "Asmens kodas" (personal code) field to the search form on the VLK website.

### Screenshots
| Before | After |
| :--- | :--- |
| ![Before](https://github.com/DayDve/userscripts/blob/master/screenshots/vlk_before.png?raw=true) | ![After](https://github.com/DayDve/userscripts/blob/master/screenshots/vlk_after.png?raw=true) |

### Features
* Adds a convenient "Asmens kodas" input field directly into the search form.
* Automatically parses date of birth, gender, and the remaining digits from the personal code to populate the original form fields.
* Remembers the last entered personal code using `sessionStorage`.
* Allows seamless switching between the custom input field and the original search form.
