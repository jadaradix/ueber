var _ = require("lodash");
var _s = require("underscore.string");

module.exports.groupify = function groupify (array, key) {
  if (Array.isArray(array) === false) return [];
  if (array.length === 0) return [];
  var groups = [];
  var blankGroup = {
    "group": null,
    "members": []
  };
  for (var arrayBit of array) {
    var existingGroup = groups.find(function (group) {
      return (group.group === arrayBit[key]);
    });
    if (existingGroup) {
      existingGroup.members.push(arrayBit);
    } else {
      var newGroup = _.clone(blankGroup);
      newGroup.group = arrayBit[key];
      newGroup.members = [arrayBit];
      groups.push(newGroup);
    }
  }
  return groups;
};

module.exports.groupifyCount = function groupifyCount (array, key) {
  var groups = exports.groupify(array, key);
  var counts = groups.map(function (group) {
    return {
      "name": group.group,
      "count": group.members.length
    };
  });
  counts = exports.sortByKey(counts, "count", true);
  return counts;
};

module.exports.bucketize = function bucketize (array, count) {
  var lCount = 0;
  var currentBucket = [];
  var buckets = [];
  if (array.length < count) {
    buckets.push(array);
    return buckets;
  }
  for (var arrayBit of array) {
    currentBucket.push(arrayBit);
    if (lCount === count - 1) {
      buckets.push(_.clone(currentBucket));
      currentBucket = [];
      lCount = 0;
    } else {
      lCount++;
    }
  }
  if (currentBucket.length > 0) buckets.push(_.clone(currentBucket));
  return buckets;
};

module.exports.sortByKey = function sortByKey (array, key, reverse) {
  var reverseValue = ((reverse === true) ? -1 : 1);
  return array.sort(function (a, b) {
    var x = a[key]; var y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0)) * reverseValue;
  });
};

module.exports.removeNulls = function removeNulls (array) {
  return array.filter(function (arrayBit) {
    return (arrayBit !== null);
  });
};

module.exports.normaliseName = function normaliseName (name) {
  var name = name.toLowerCase();
  name = _s.camelize(name);
  name = _s.humanize(name);
  name = name.split(" ").map(function (nameBit) {
    return nameBit[0].toUpperCase() + nameBit.substring(1);
  }).join(" ");
  return name;
};

module.exports.initialName = function initialName (name) {
  return name.split(" ").map(function (nameBit) {
    return nameBit[0].toUpperCase();
  }).join("");
};

module.exports.cleanString = function cleanString (string) {
  return Array.from(string).filter(function (stringBit, index) {
    var s = stringBit.charCodeAt(0);
    return (s >= 32 && s < 127);
  }).join("");
};

module.exports.isVowel = function isVowel (character) {
  return (/[aeiouAEIOU]/.test(character));
};

module.exports.arrayValueBoolify = function arrayValueBoolify (array, value) {
  return (value in array ? array[value] : false);
};

module.exports.addEvent = function addEvent (element, eventName, fn) {
  if (element.addEventListener) {
    element.addEventListener(eventName, fn, false);
  } else if (element.attachEvent) {
    element.attachEvent("on" + eventName, fn);
  } else {
    throw "Neither addEventListener or attachEvent methods were available on the element";
    // disallow chaining to avoid a train wreck
    return false;
  }
  // allow chaining
  return element;
};

module.exports.hasClass = function hasClass (element, className) {
  // http://stackoverflow.com/a/15226442
  return (new RegExp("(\\s|^)" + className + "(\\s|$)").test(element.className));
};

module.exports.showHide = function showHide (element, doShow) {
  if (doShow === true) {
    element.style.display = (element.hasAttribute("data-fade-inline-block") ? "inline-block" : "block");
    element.style.opacity = 1;
  } else {
    element.style.display = "none";
    element.style.opacity = 0;
  }
};

module.exports.dateNow = function () {
  return (Date.now() || Date().getTime());
};

module.exports.getObjectValues = function getObjectKeys (object) {
  return Object.keys(object).map(function (key) {
    return object[key];
  });
};