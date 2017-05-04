# Freecodecamp: API Projects - Timestamp Microservice

## Project Checklist

  1. I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.

  2. If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.

  3. When I visit that shortened URL, it will redirect me to my original link.

## Requirements

  node v6.9+

## Installation

  To install:

    git clone https://github.com/sfallmann/url-shortener.git
    cd url-shortener
    npm install

## Usage

  To run locally:
    
    npm start

  Or go to:

  https://young-waters-71078.herokuapp.com/urls/shorten/<url>
  https://young-waters-71078.herokuapp.com/urls/retrieve/<shorturl>

## Tests

  To test:

    npm test