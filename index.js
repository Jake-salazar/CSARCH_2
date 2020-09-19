
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const app = express();
const session = require('express-session');

const flash = require('connect-flash');

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});


var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })








app.engine( 'hbs', exphbs({
  extname: 'hbs',
  defaultView: 'main', 
  layoutsDir: path.join(__dirname, '/views/layouts'), 
  partialsDir: path.join(__dirname, '/views/partials'), 

}));

app.set('view engine', 'hbs');





app.get('/', function(req, res) {
    res.render('home',{
      unsignedDec: '',
      signedDec: ''
    });
});


app.post('/Calculate',urlencodedParser ,(req, res) => {
   var hexData = req.body.data;
   var unsigned = "";
   var signed = "";


   function isHex(str)
   {
    regexp = /^[0-9a-fA-F]+$/;
     
           if (regexp.test(str))
             {
               return true;
             }
           else
             {
               return false;
             }
   }


   var ConvertBase = function (hex) {
    return {
        from : function (baseFrom) {
            return {
                to : function (baseTo) {
                    return parseInt(hex, baseFrom).toString(baseTo);
                }
            };
        }
    };
};

ConvertBase.hex2bin = function (str) {
  return ConvertBase(str).from(16).to(2);
};

let data = ConvertBase.hex2bin(hexData); 


function uintToInt(uint, nbit) {
  nbit = +nbit || 64;
  if (nbit > 64) throw new RangeError('uintToInt only supports ints up to 64 bits');
  uint <<= 64 - nbit;
  uint >>= 64 - nbit;
  return uint;
};


if(isHex(hexData) === false){
  req.flash('error_msg','Error input');
  res.redirect('/');
 }
else if (data[0] == '1'){
  // converts bin to dec  
  var bin2dec = parseInt(data,2).toString(10);
  unsigned = bin2dec;
  signed =  uintToInt(bin2dec,data.length);

  res.render('home',{
    input: hexData,
    unsignedDec: unsigned,
    signedDec: signed
  });
}
else if (data[0] === '0'){
    var bin2dec = parseInt(data,2).toString(10);
    unsigned = bin2dec;
    signed =  uintToInt(bin2dec,data.length);

    res.render('home',{
      input: hexData,
      unsignedDec: unsigned,
      signedDec: signed
    });
}
  
});




const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port: ${port}...`) );


app.use(express.static('public'));



