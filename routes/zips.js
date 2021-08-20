var express = require('express');
var router = express.Router();

var zipCodes = new Map();

const validateZipCode = () => {
    return function (req, res, next) {
      let zipCode = req.params.zip;
      let message = false;
      
      if (!zipCode)
        message = "Please provide a zip code";
      if (zipCode.length !== 5 || isNaN(zipCode)) 
        message = "Input is not a valid zip code";
      
      if (message) {
        res.status(400).send({
          message: message
        })
      } else {
        next();
      }
    }
};

const handleZipCodeErrors = (err, req, res, next) => {
  res.status(500).send({
    message: "Something went wrong!"
  })
}

/**
 * Insert new Zip Code
 * @route
 * @method POST
 * @name insertZip
 * @description If a :zip param is given, insert zip into map
*/
router.post('/:zip', validateZipCode(), (req, res, next) => {
  try {
    let zipCode = req.params.zip;
    zipCodes.set(zipCode, 1);

    res.status(201).send({
      "message": `Zip code ${zipCode} inserted.`
    });
  } catch (err) {
    next(err)
  }
});

/**
 * Check if Zip Code exists
 * @route
 * @method HEAD
 * @name hasZip
 * @description Check if :zip exists
*/
router.head('/:zip', validateZipCode(), (req, res, next) => {
  try {
    let zipCode = req.params.zip;
    let exists = zipCodes.has(zipCode);

    res.header("X-Zip-Exists", exists);

    if (exists) res.sendStatus(200) // exists
    else res.sendStatus(404) // does not exist
  } catch (err) {
    next(err)
  }
});

/**
 * Delete Zip Code
 * @route
 * @method DELETE
 * @name deleteZip
 * @description If :zip is provided, delete the zip code from the map
*/
router.delete('/:zip', validateZipCode(), (req, res, next) => {
  try {
    let zipCode = req.params.zip;

    if (zipCodes.delete(zipCode)) {
      res.status(200).send({
        "message": `Zip code ${zipCode} deleted.`
      });
    } else {
      res.status(404).send({
        "message": `Zip code ${zipCode} does not exist`
      })
    }
  } catch (err) {
    next(err)
  }
});

/**
 * Get Zip Codes
 * @route
 * @method GET
 * @name displayZip
 * @description Display Zip codes currently available in map, in unique format
*/
router.get('/', (req, res, next) => {
  try {
    let zipCodeString = ""
    let foundZipCodes = {};

    for (let [zipCodeIndex, value] of zipCodes) {
      let zipCodeNumber = parseInt(zipCodeIndex);

      if (!foundZipCodes[zipCodeNumber]) {
        let currentZipCodeRange = [zipCodeNumber];
        let currentZipCodeInc = zipCodeNumber;
        let currentZipCodeDec = zipCodeNumber;
        let searching = true;

        while (searching) {
          currentZipCodeInc++;
          currentZipCodeDec--;

          if (zipCodes.has(`${currentZipCodeInc}`)) {
            foundZipCodes[currentZipCodeInc] = 1;
            currentZipCodeRange = [currentZipCodeRange[0], currentZipCodeInc];
          }
          
          if (zipCodes.has(`${currentZipCodeDec}`)) {
            foundZipCodes[currentZipCodeDec] = 1;
            currentZipCodeRange = [currentZipCodeDec, currentZipCodeRange[currentZipCodeRange.length - 1]]
          }
          
          if (!zipCodes.has(`${currentZipCodeInc}`) && !zipCodes.has(`${currentZipCodeDec}`))
            searching = false;
        }
        
        zipCodeString = zipCodeString + `${currentZipCodeRange.join("-")}, `
      }
    }

    res.status(200).send({
      message: zipCodeString.slice(0, -2) // remove last comma + space
    });
  } catch (err) {
    next(err)
  }
});

router.use(handleZipCodeErrors)

module.exports = router;
