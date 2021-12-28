/*****
 * this file contains all of the logical 
 * functions used to scrub the data.
 */


const publisherBookArray=[];
const publisherPublisherArray=[];
const publisheridBookidArray=[];


const authorBookArray=[];
const authorAuthorArray=[];
const authoridBookidArray=[];

function matchPublisherBook(){ //match publisher info to book info and push it to publisheridBookidArray[]

    publisherBookArray.forEach(x=>{// loop through publisherBookArray[]

        publisherPublisherArray.forEach(y=>{// loop through publisherPublisherArray[]

            if(x[1] == y[1]){ // if publisher data mathces, create publisherBook object and add bookid and publisherid to it, then push object to array[]
                let publisherBook ={};
                publisherBook.bookid = x[0];
                publisherBook.publisherid=y[0];
                publisheridBookidArray.push(publisherBook);
            }
        });

    });

}

function matchAuthorBook(){//match author info to book info and push it to authoridBookidArray[]

    authorBookArray.forEach(x=>{//loop thorugh authorBookArray[]

        authorAuthorArray.forEach(y=>{// loop through authorAuthorArray[]

            if(x[1] == y[1]){// if author info matches, create authorBook object and add bookid and authorid to it, then push object to array[]
                let authorBook ={};
                authorBook.bookid = x[0];
                authorBook.authorid=y[0];
                authoridBookidArray.push(authorBook);
            }
        });

    });

}
  

  function splitPublisher(_s){//split publisher fucntion
           var s = _s[0].split(':');//split on ':' to seperate location from publisher
           var publish = 'Unknown';
      if(s[1]){
            publish = s[1].trim();
      }
    return [publish,s[0],_s[0]];// return split sections along with non-split in array
    
  }

  function splitAuthor(_a){//split author fucntion

    var regexpYears = /\b(\d{4})(\-*)(\d*)\b/g; //regex matching at least four digits.  will also match four digits with a dash or four digits with a dash and more digits
    var regexpAuthor =  /\b[^\d]+\b/g;// regex matching a name
    var years = ["Unknown"];
    var author = [];
    var aa="";
   
    String.prototype.replaceAt = function(index, replacement) {//fucntion that replaces a value at an index
      return this.substr(0, index) + replacement + this.substr(index + replacement.length);
    }

    if(_a.includes("M''Crie")){
      aa=_a.replaceAt(67,",");// repalce char at index of 67 with a comma
      _a = aa;
    }

    //console.log(_a);
    var a = _a.split(';');// split on ';'
   
   a.forEach(x=>{// loop through split
    

     years = x.match(regexpYears)?x.match(regexpYears):["Unknown"]; // if match regexpYears then set equal to match else set equal to "Unknown"
     author = x.match(regexpAuthor);
     //years = years.length==4? years+"-NA": years;
        
     if(author[0].length == 0 ){
      years[0] = years+"-Unk";
    }

         
   });
        
 
//console.log("Author: "+author[0]+"     Years: "+years[0])
return [author[0], years[0]];
// return my_publisher;

  }

  function fixdescriptionandnotes(_s){
   // É
 
   // _s = _s.normalize("NFD").replace(/\p{Diacritic}/gu, " ")
   
    
   _s = _s.replace(/'+/g, "''"); 
   _s =  _s.replace(/"/g, ""); 
   _s =   _s.trim();
   _s = _s.replace(/\?+/g,'Unknown');
   _s = _s.length==0?"Unknown":_s;
   
    return _s;
 }
 function fixtypeandgenre(_s){

    _s.replace(/["]+/g, ''); 
    _s.replace(/[']+/g, "''"); 
    _s.trim();
    
    if(_s.includes("?")){

        _s="U";
    }else if(_s == 'unknown'){
        _s="U";
    }else if(_s==''){
        _s = "U";
    }else if(_s.length>2){
        _s="U"
    }
    return _s;
 }

 module.exports = {fixdescriptionandnotes, fixtypeandgenre, matchAuthorBook,matchPublisherBook, splitAuthor, splitPublisher,authorAuthorArray,authorBookArray, authoridBookidArray,  publisherBookArray, publisherPublisherArray, publisheridBookidArray}