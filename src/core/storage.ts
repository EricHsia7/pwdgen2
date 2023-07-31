// Import required modules and interfaces
import fine_grained_password from './fine-grained-password';
import utilities from './utilities';
import interaction from '../user-interfaces/interaction';
const md5 = require('md5');

// Interface for an encrypted password entry
interface EncryptedPassword {
  website: string;
  username: string;
  encrypted_password: string;
  aes_iv: number; // Initialization vector for encryption
  note: string | null; // Comes in base64 format
  time_stamp: string; // Comes in ISO 8601 format
  id: string;
}

// Interface for a decrypted password entry
interface DecryptedPassword {
  website: string;
  username: string;
  password: string;
  note: string | null; // Comes in base64 format
  time_stamp: string; // Comes in ISO 8601 format
  id: string;
}

// Export Local Storage object to the global scope
export const LS = window.localStorage;

// Function to search items by name in Local Storage
export function searchItemsbyname(name) {
  var gh = [];
  for (var t in window.localStorage) {
    if (String(t).indexOf(name) > -1) {
      gh.push(t);
    }
  }
  return gh;
}

// Function to list all saved passwords with decryption
export function listSavedPassword(): object[] {
  var list = searchItemsbyname('pwdgen2_saved_b');
  var list_len = list.length;
  var list_decrypted = [];
  for (var k = 0; k < list_len; k++) {
    // Decrypt the encrypted password
    var this_item = JSON.parse(String(LS.getItem(list[k])));
    if (this_item.hasOwnProperty('history')) {
      continue;
    }
    var url = '';
    var website_icon = false;
    if (utilities.isValidURL(this_item.website)) {
      url = this_item.website;
      if (!(this_item.website.indexOf('http://') > -1 || this_item.website.indexOf('https://') > -1)) {
        url = 'https://' + url;
      }
      var url_obj = new URL(url);
      url_obj.search = '';
      url_obj.protocol = 'http://';
      website_icon = `https://remote-ivory-bovid.faviconkit.com/${url_obj.toString().replace('http://', '')}/256`;
    }
    // Add the decrypted entry to the list
    list_decrypted.push({
      website_icon: website_icon,
      website: this_item.website,
      password: utilities.deur(utilities.decryptString(this_item.encrypted_password, this_item.aes_iv)),
      username: this_item.username,
      note: this_item.note,
      time_stamp: this_item.time_stamp,
      id: this_item.id
    });
  }
  // Sort the list based on timestamp
  list_decrypted.sort(function (a, b) {
    return new Date(b.time_stamp).getTime() - new Date(a.time_stamp).getTime();
  });
  return list_decrypted;
}

// Function to upgrade data from an older version
export function upgradeData(): void {
  // Define the ID pattern for generating new IDs
  var id_pattern = [
    {
      type: 'group',
      group: [
        {
          type: 'regex',
          regex: '/[A-Za-z0-9]/g',
          quantity: 32,
          repeat: true
        }
      ],
      actions: ['shuffle']
    }
  ];

  // Search for items from the Local Storage
  var list = searchItemsbyname('pwdgen2_saved_a');
  if (list.length <= 0) {
    return '';
  }
  var list_len = list.length;
  var list_encrypted = [];
  for (var k = 0; k < list_len; k++) {
    // Extract data from the old version (<=1.8) and upgrade to the new version (>=1.9)
    var this_item = String(LS.getItem(list[k])).split(':');
    var hash = list[k].split('_')[3];
    var pwtime = new Date();
    pwtime.setTime(this_item[2]);
    var id = fine_grained_password.generate(id_pattern, 'production');
    var note = LS.getItem(`pwdgen2_saved_notes_cf_${hash}`) || '';
    list_encrypted.push({
      website: '',
      encrypted_password: this_item[0],
      aes_iv: parseInt(this_item[1]),
      note: note,
      time_stamp: pwtime,
      id: id
    });
    LS.setItem(`pwdgen2_saved_b_${id}`, JSON.stringify(list_encrypted[list_encrypted.length - 1]));
    LS.removeItem(list[k]);
  }
}

// Function to set a password entry
export function setPassword(password, username, time, website, note, id): void {
  // Encrypt the password and save the entry to Local Storage
  var encryption = utilities.encryptString(utilities.enur(password));
  var json = {
    website: website,
    username: username,
    encrypted_password: encryption[0],
    aes_iv: encryption[1],
    note: note === '' ? null : btoa(utilities.enur(note)),
    time_stamp: time,
    id: id
  };
  LS.setItem('pwdgen2_saved_b_' + id, JSON.stringify(json));
}

// Function to add a new password entry
export function addPassword(password, username, website, note): string {
  // Generate a new ID pattern for the entry
  var id_pattern = [
    {
      type: 'group',
      group: [
        {
          type: 'regex',
          regex: '/[A-Za-z0-9]/g',
          quantity: 32,
          repeat: true
        }
      ],
      actions: ['shuffle']
    }
  ];

  // Get the current timestamp
  var time = new Date().toISOString();
    // Generate a new ID
  var id = fine_grained_password.generate(id_pattern, 'production');

  // Set the password entry
  setPassword(password, username, time, website, note, id);
  return id;
}

// Function to modify an existing password entry
export function modifyPassword(password, username, website, note, id): void | string {
  // Get the Local Storage keys for the entry and its history
  var localStorage_key = `pwdgen2_saved_b_${id}`;
  var localStorage_history_key = `pwdgen2_saved_b_history_${id}`;

  // Check if the entry exists
  if (LS.hasOwnProperty(localStorage_key)) {
    var json = JSON.parse(String(LS.getItem(localStorage_key)));

    // Encrypt the password and create the modified JSON
    var encryption = utilities.encryptString(utilities.enur(password));
    var modified_json: EncryptedPassword = {
      website: website,
      username: username,
      encrypted_password: encryption[0],
      aes_iv: encryption[1],
      note: note === '' ? null : btoa(utilities.enur(note)),
      time_stamp: json.time_stamp,
      id: id
    };

    // Check if the modified entry is the same as the existing one, if yes, return '' to quit function
    if (
      md5(JSON.stringify({ website: json.website, username: json.username, password: utilities.deur(utilities.decryptString(json.encrypted_password, json.aes_iv)), note: json.note })) ===
      md5(JSON.stringify({ website: website, username: username, password: password, note: note }))
    ) {
      return '';
    }

    // Create or update the history entry
    if (LS.hasOwnProperty(localStorage_history_key)) {
      var history: object = JSON.parse(String(LS.getItem(localStorage_history_key)));
    } else {
      var history: object = { id: id, history: [] };
    }
    history['history'].push(json);
    LS.setItem(localStorage_history_key, JSON.stringify(history));

    // Update the password entry
    LS.setItem(localStorage_key, JSON.stringify(modified_json));
  }
}

// Function to remove a password entry
export function removePassword(id): boolean {
  // Check if the entry exists, and if yes, remove it from Local Storage
  if (LS.hasOwnProperty(`pwdgen2_saved_b_${id}`)) {
    LS.removeItem(`pwdgen2_saved_b_${id}`);
    if (LS.hasOwnProperty(`pwdgen2_saved_b_history_${id}`)) {
      LS.removeItem(`pwdgen2_saved_b_history_${id}`);
    }
    return true;
  }
  return false;
}

// Function to handle the import of data
export function importdatahandler(event) {
  // Read the file and import the data to Local Storage
  var f = event.target.files[0];
  var reader = new FileReader();
  reader.onload = (function (theFile) {
    return function (e) {
      var fileTextContent = e.target.result;
      var json = JSON.parse(fileTextContent);
      var data = json.data;
      var data_len = data.length;

      // Save each entry to Local Storage
      for (var i = 0; i < data_len; i++) {
        var this_item = data[i];
        localStorage.setItem(this_item.key, JSON.stringify(JSON.parse(this_item.content)));
      }

      // Upgrade the data to the new version
      upgradeData();

      // Display success message and update the user interface
      interaction.prompt.prompt_message('Imported data successfully.');
      interaction.main_page.printSavedPasswordList();
    };
  })(f);
  reader.readAsText(f);
}

// Function to generate an export file
export function generateExportFile() {
  // Get all saved password entries and create a JSON object for export
  var list = searchItemsbyname('pwdgen2_saved_b');
  var list_len = list.length;
  var export_list = [];
  for (var k = 0; k < list_len; k++) {
    var this_item = JSON.parse(String(LS.getItem(list[k])));
    export_list.push({ key: list[k], content: JSON.stringify(this_item, null, 2) });
  }

  // Return the JSON object as a string
  return JSON.stringify({ data: export_list, version: '2023-07-30', export_time_stamp: new Date().toISOString() }, null, 2);
}
