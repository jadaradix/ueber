var _ = require("lodash");
var _s = require("underscore.string");

exports.groupify = function groupify (array, key) {
  if (array.length === 0) return [];
  var groups = [];
  var blankGroup = {
    "group": null,
    "members": []
  };
  _.each(array, function (arrayBit) {
    var existingGroup = _.find(groups, function (group) {
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
  });
  return groups;
};

exports.groupifyCount = function groupifyCount (array, key) {
  var groups = exports.groupify(array, key);
  var counts = _.map(groups, function (group) {
    return {
      "name": group.group,
      "count": group.members.length
    };
  });
  counts = exports.sortByKey(counts, "count", true);
  return counts;
};

exports.bucketize = function bucketize (array, count) {
  var lCount = 0;
  var currentBucket = [];
  var buckets = [];
  if (array.length < count) {
    buckets.push(array);
    return buckets;
  }
  for (var i = 0; i < array.length; i++) {
    currentBucket.push(array[i]);
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

exports.sortByKey = function sortByKey (array, key, reverse) {
  var reverseValue = ((reverse === true) ? -1 : 1);
  return array.sort(function (a, b) {
    var x = a[key]; var y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0)) * reverseValue;
  });
};

exports.normaliseName = function normaliseName (name) {
  var name = name.toLowerCase();
  name = _s.camelize(name);
  name = _s.humanize(name);
  name = _.map(name.split(" "), function (namePart) {
    return namePart[0].toUpperCase() + namePart.substring(1);
  }).join(" ");
  return name;
};

exports.initialName = function initialName (name) {
  return _.map(name.split(" "), function (namePart) {
    return namePart[0].toUpperCase();
  }).join("");
};

exports.cleanString = function cleanString (string) {
  return _.filter(string, function (stringBit, index) {
    var s = stringBit.charCodeAt(0);
    return (s >= 32 && s < 127);
  }).join("");
};

exports.isVowel = function isVowel (character) {
  return (/[aeiouAEIOU]/.test(character));
};