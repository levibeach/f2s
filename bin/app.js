#!/usr/bin/env node
'use strict'

const fs = require('fs')
const fileFolder = './'
const args = require('args-parser')(process.argv)

function convertToCSV(objArray) {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray
  var str = ''
  for (var i = 0; i < array.length; i++) {
    var line = ''
    for (var index in array[i]) {
      if (line != '') line += '•'
      line += array[i][index]
    }
    str += line + '\r\n'
  }
  return str
}

function writeToCSVFile(data) {
  const filename = 'output.csv'
  fs.writeFile(filename, convertToCSV(data), err => {
    if (err) {
      console.log('Error writing to csv file', err)
    } else {
      console.log(`✔ Done! Saved as ${filename}`)
    }
  })
}

let parseFolder = new Promise(function (success, failure) {
  let i = 1
  let totalFiles = 0;
  let buffer = []
  fs.readdir(fileFolder, (err, files) => {
    if (err) failure(err)
    console.log(`${files.length} total files/folders`)
    console.log('Parsing files…')
    files.forEach(file => {
      if (fs.existsSync(file) && fs.lstatSync(file).isFile()) totalFiles++
    });
    files.forEach(file => {
      if (fs.existsSync(file) && fs.lstatSync(file).isFile()) {
        fs.readFile(`${fileFolder}/${file}`, 'utf8', function (err, data) {
          if (err) failure(err)
          const item = {
            file: file,
            content: data.replace(/\n/g, '')
          }
          console.log(file)
          buffer.push(item)
          if (i == totalFiles) {
            success(buffer)
          } else {
            i++
          }
        })
      }
    })
  })
})

parseFolder.then(
  function (data) {
    writeToCSVFile(data)
  },
  function (error) {console.log(error)}
)