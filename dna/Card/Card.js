'use strict';

// -----------------------------------------------------------------
//  This stub Zome code file was auto-generated by hc-scaffold
// -----------------------------------------------------------------

/**
 * Called only when your source chain is generated
 * @return {boolean} success
 */
function genesis () {
  // any genesis code here
  return true;
}

// -----------------------------------------------------------------
//  validation functions for every DHT entry change
// -----------------------------------------------------------------

/**
 * Called to validate any changes to the DHT
 * @param {string} entryName - the name of entry being modified
 * @param {*} entry - the entry data to be set
 * @param {?} header - ?
 * @param {?} pkg - ?
 * @param {?} sources - ?
 * @return {boolean} is valid?
 */
function validateCommit (entryName, entry, header, pkg, sources) {
  switch (entryName) {
    case "Card":
      // validation code here
      return true;

    case "card_links":
      return true;

    case "favorites_links":
      return true;

    default:
      // invalid entry name!!
      return false;
  }
}

/**
 * Called to validate any changes to the DHT
 * @param {string} entryName - the name of entry being modified
 * @param {*} entry - the entry data to be set
 * @param {?} header - ?
 * @param {?} pkg - ?
 * @param {?} sources - ?
 * @return {boolean} is valid?
 */
function validatePut (entryName, entry, header, pkg, sources) {
  switch (entryName) {
    case "Card":
      // validation code here
      return true;

    case "card_links":
      return true;

    case "favorites_links":
      return true;

    default:
      // invalid entry name!!
      return false;
  }
}

/**
 * Called to validate any changes to the DHT
 * @param {string} entryName - the name of entry being modified
 * @param {*} entry - the entry data to be set
 * @param {?} header - ?
 * @param {*} replaces - the old entry data
 * @param {?} pkg - ?
 * @param {?} sources - ?
 * @return {boolean} is valid?
 */
function validateMod (entryName, entry, header, replaces, pkg, sources) {
  switch (entryName) {
    case "Card":
      // validation code here
      return false;
    default:
      // invalid entry name!!
      return false;
  }
}

/**
 * Called to validate any changes to the DHT
 * @param {string} entryName - the name of entry being modified
 * @param {string} hash - the hash of the entry to remove
 * @param {?} pkg - ?
 * @param {?} sources - ?
 * @return {boolean} is valid?
 */
function validateDel (entryName, hash, pkg, sources) {
  switch (entryName) {
    case "Card":
      // validation code here
      return false;
    default:
      // invalid entry name!!
      return false;
  }
}

/**
 * Called to get the data needed to validate
 * @param {string} entryName - the name of entry to validate
 * @return {*} the data required for validation
 */
function validatePutPkg (entryName) {
  return null;
}

/**
 * Called to get the data needed to validate
 * @param {string} entryName - the name of entry to validate
 * @return {*} the data required for validation
 */
function validateModPkg (entryName) {
  return null;
}

/**
 * Called to get the data needed to validate
 * @param {string} entryName - the name of entry to validate
 * @return {*} the data required for validation
 */
function validateDelPkg (entryName) {
  return null;
}

function validateLink(linkEntryType,baseHash,links,pkg,sources){
  return true;
}

function validateLinkPkg(entry_type) { return null;}

function isErr (result) {
  return ((typeof result === "object") && (result.name === "HolochainError"));
}

function cardCreate (param) {
  var card = {
    title: param.title,
    content: param.content,
    // timestamp
    timestamp: 123,
    version: 0
  }
  var hash = commit("Card", card);

  debug("card title:" + card.title)
  debug("card hash:" + hash)

  if (param.parentHash) {
    debug("parent hash:" + param.parentHash)

    cardLink({
      theParent: param.parentHash,
      theChild: hash
    })
  }

  return hash;
}

function cardRead (hash) {
  return JSON.parse(get(hash, {GetMask:HC.GetMask.Entry}));

}

function cardUpdate (param) {

}

function cardDelete (param) {

}

function cardLink (params) {

  // debug("HERE: ");
  // debug(params);
  return commit("card_links", {
    "Links": [
      { "Base": params.theParent, "Link": params.theChild, "Tag": "CHILD_OF" },
      { "Base": params.theChild, "Link": params.theParent, "Tag": "PARENT_OF" }]
  });
}

function cardGetLinks(baseHash) {
  // debug("HERE: ");
  // debug(baseHash);
  var links = getLinks(baseHash, "");

  var res = [];
  for (var ix in links) {
    res.push({
      card: links[ix].Hash,
      type: links[ix].Tag
    })
  }
  return res;
}

function cardAddAsFavorite(targetCardHash) {
  return commit("favorites_links", {
    "Links": [
      { "Base": App.Agent.Hash, "Link": targetCardHash, "Tag": "MY_FAVORITE" }]
  });
}

function cardGetMyFavorites () {
  var links = getLinks(App.Agent.Hash, "MY_FAVORITE");

  var res = [];
  // debug(links)
  // debug(isErr(links))
  if (!isErr(links)) {
    for (var ix in links) {
      res.push(links[ix].Hash);
    }
  }

  return res;
}
