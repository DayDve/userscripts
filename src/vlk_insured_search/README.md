# VLK Insured Search
[![RU](https://img.shields.io/badge/lang-RU-blue)](#) [![EN](https://img.shields.io/badge/lang-EN-lightgrey)](README.en.md) [![LT](https://img.shields.io/badge/lang-LT-lightgrey)](README.lt.md) [![Back](https://img.shields.io/badge/Back-List-black)](../../README.md)

[![Install](https://img.shields.io/badge/Install-Direct-brightgreen)](vlk_insured_search.user.js?raw=1)

Добавляет единое поле "Asmens kodas" в форму поиска застрахованных лиц на сайте VLK.

### Скриншоты
| До (Before) | После (After) |
| :--- | :--- |
| ![Before](https://github.com/DayDve/userscripts/blob/master/screenshots/vlk_before.png?raw=true) | ![After](https://github.com/DayDve/userscripts/blob/master/screenshots/vlk_after.png?raw=true) |

### Функционал
* Добавляет поле для ввода "Asmens kodas" прямо в форму поиска.
* Автоматически парсит дату рождения, пол и последние цифры из введённого личного кода для заполнения оригинальных полей формы.
* Запоминает последнее успешно введённое значение с помощью `sessionStorage`.
* Позволяет легко переключаться между кастомным полем и оригинальной формой.
