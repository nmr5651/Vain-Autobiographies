//catch all errors
process.on('unhandledRejection',(reason, promise)=>{
    console.log(reason+'          '+promise);
});

//import vars from sql.js
const {createDBs, insertBook, getPubliserFromBook, insertNewPublisher, getPubliserWithBookIDFromBook, getPubliserWithPublisherIDFromPublisher, insertNewPublisherBook,
    getAuthorFromBook, getAuthorWithBookIDFromBook, getAuthorWithAuthorIDFromAuthor, insertNewAuthor, insertNewAuthorBook,ifDBExists, getTypeWithBookIDFromBook
    ,insertNewTypeBook,getSubjectWithBookIDFromBook,insertNewSubjectBook, scrubTables} = require('./sql.js');

// import vars from logic.js    
const {fixdescriptionandnotes, fixtypeandgenre, matchAuthorBook,matchPublisherBook, splitAuthor, splitPublisher
  ,authorAuthorArray,authorBookArray, authoridBookidArray,  publisherBookArray, publisherPublisherArray, publisheridBookidArray} = require('./logic.js');

//import vars from creds.js  
const {credentials, credentialsMain} = require('./creds.js');
//create postgres pool and client
const { Pool, Client } = require("pg");
//import nodejs tools
var pgtools = require("pgtools");
const fs = require('fs');
const readline = require('readline');
const stream = require('stream');
const input = fs.createReadStream("vain.tsv");

//create needed array constants
const bookArray = [];
const dbArray= [];
const publisherArray = [];
const authorArray = [];
const typeBookArray=[];
const subjectBookArray=[];

//instantiate pool with default postgres database
const poolMain = new Pool(credentialsMain);

//instantiate pool with vain_db database
const pool = new Pool(credentials);


//read lines from the vain.tsv file
  function readLines({ input }) {
    const output = new stream.PassThrough({ objectMode: true });
    const rl = readline.createInterface({ input });
    rl.on("line", line => { 
      output.write(line);
    });
    rl.on("close", () => {
      output.push(null);
    }); 
    return output;
  }


  

//check if vain_db already exists
  async function checkForVainDB() {
    const client = await poolMain.connect();
    const result = await client.query({
        rowMode: 'array',
        text: ifDBExists,
    })
    result.rows.forEach(row=>{
        dbArray.push(row );
    });

    await client.end();
    return result;
}
//create vain_db
async function CreateDB() {
    const client = new Client(credentials);
    await client.connect();
    const now = await client.query(createDBs);
    await client.end();
  console.log(now);
    return now;
}


//execte sql command with no varaibale injection
async function executeCommand(sql) {
    
  return  pool.query(sql);
   
   
}

//insert an object into vain_db
async function insertObject(sql, obj) {
    
   return  pool.query(sql,obj);
    
    
}

//get object from vain_db.  must sql and array that you wnat populated with results
async function getObject(sql,array) {
    const client = await pool.connect();
    const result = await client.query({
        rowMode: 'array',
        text: sql,
    })
    result.rows.forEach(row=>{
        array.push(row );
    });

    await client.end();
    return result;
}



  
//async function that inserts vain.tsv into vain_db.book and populates bookArray[]
(async () => {
    let i=0;
    
    
    
    for await (const line of readLines({ input })) {
        let my_book = {};
        const rls = line.split('\t');
        my_book.type =fixtypeandgenre(rls[0]);
        my_book.hadHelp= fixtypeandgenre(rls[1]);
        my_book.genre= fixtypeandgenre(rls[2]);
        my_book.author= fixdescriptionandnotes(rls[3]);
        my_book.title= fixdescriptionandnotes(rls[4]);
        my_book.publisher= fixdescriptionandnotes(rls[5]);
        
        my_book.description= fixdescriptionandnotes(rls[7]);
        my_book.namedPersons= fixdescriptionandnotes(rls[8]);
        my_book.notes= fixdescriptionandnotes(rls[9]);
        my_book.located= fixdescriptionandnotes(rls[10]);
        
        if(rls[6].length >4){
            my_book.year=  rls[6].substring(0,4);
        }else if(rls[6].length <4){
            my_book.year=  "9999";
        }else if(rls[6].includes("?")){
            my_book.year=  "9999";
        }else{
            my_book.year=  rls[6];
        }
    
        if(i==0){
            i++;
        }else {
            bookArray.push(my_book);
        

        }
    
        
  }
  
})();
 
 

//these are all of the other asyn steps that take place to populate the database
(async () => {
    await checkForVainDB();//check to see if vain_eb exists by populating dbArray if exists
if(dbArray.length == 1){//check if dbArray has a record.  if true drop current VAIN_db and create a new on
    await pgtools.dropdb(credentialsMain, "vain_db");//drop current vain_db
    await pgtools.createdb(credentialsMain, "vain_db");//create new vain_db
}else{//if not true just create vain_db without drop
    await pgtools.createdb(credentialsMain, "vain_db");// create new vain_db
    }
           
  await executeCommand(createDBs);//execute sql to create tables

   await Promise.all(bookArray.map(async (elem) => {//loop through bookArray[] and insert into book table
        try {
          //pass sql and vars to insertObject()
            await insertObject(insertBook,[elem.type, elem.hadHelp, elem.genre, elem.title, elem.year, elem.description, elem.namedPersons, elem.notes, elem.located, elem.publisher, elem.author]);
            
        } catch (error) {
          console.log('error'+ error);
          console.log(elem);
          
        }
      }))
     
    console.log("Done adding books");
    console.log("adding publishers");
    await getObject(getPubliserFromBook,publisherArray);//fill publisherArray with distinct publisher data from book table
   
    await Promise.all( publisherArray.map(async (elem) => {//loop through publisherArray[] and insert into publisher table
        try {
            await insertObject(insertNewPublisher,splitPublisher(elem)); //pass sql and vars to insertObject()
            
        } catch (error) {
          console.log('error'+ error);
          console.log(elem);
          
        }
      }))
      await getObject(getPubliserWithBookIDFromBook, publisherBookArray); //fill publisherBookArray[] with publisher and book data from book table 
    
      await getObject(getPubliserWithPublisherIDFromPublisher, publisherPublisherArray); // fill publisherPublisherArray[] with plublisher info from publisher table
    
      await matchPublisherBook();// match publisher data to book data and push it to publisheridBookidArray[]
      await Promise.all( publisheridBookidArray.map(async (elem) => {// loop through publisheridBookidArray[] and insert it into publisher_book table
        try {
          //pass sql and vars to insertObject()
            await insertObject(insertNewPublisherBook,[elem.publisherid, elem.bookid]);
            
        } catch (error) {
          console.log('error'+ error);
          console.log(elem);
          
        }
      }))
      console.log("Done adding Publishers");
      console.log("adding Authors");


      await getObject(getAuthorFromBook, authorArray);//fill authorArray[] with distinct author data from book table
    
      await Promise.all( authorArray.map(async (elem) => {// loop through authorArray[] and insert it into author table
        try {
            //pass sql and vars to insertObject()
            await insertObject(insertNewAuthor,splitAuthor(elem[0]));
            
        } catch (error) {
          console.log('error'+ error);
          console.log(elem);
          
        }
      }))
      await getObject(getAuthorWithBookIDFromBook, authorBookArray);// fill authorBookArray[] with author and book info from book table
      
      await getObject(getAuthorWithAuthorIDFromAuthor, authorAuthorArray);  //fill authorAuthorArray[] with author info from author table
    
      await matchAuthorBook();//match booka nd author info and push it to authoridBookidArray[]
      await Promise.all( authoridBookidArray.map(async (elem) => {// loop through authoridBookidArray[] and insert it into author_book table
        try { 
          // pass sql and vars to inserObject()
            await insertObject(insertNewAuthorBook,[elem.authorid, elem.bookid]);
            
        } catch (error) {
          console.log('error'+ error);
          console.log(elem);
          
        }
      }))
      console.log("Done adding Authors");

      await getObject(getTypeWithBookIDFromBook, typeBookArray);// fill typeBookArray[] with book type and id from book table


      await Promise.all( typeBookArray.map(async (elem) => {//loop through typBookArray[] and insert into type_book table 
        try {
            await insertObject(insertNewTypeBook,[elem[0], elem[1]]);
            
        } catch (error) {
          console.log('error'+ error);
          console.log(elem);
          
        }
      }))

      console.log("Done adding Types");
      await getObject(getSubjectWithBookIDFromBook, subjectBookArray);// fill subjectBookArray[] with  subject and book id from book table

      

      await Promise.all( subjectBookArray.map(async (elem) => {//loop thgrough subjectBookArray[] and insert subject and book id into subject_book table
        try {
            await insertObject(insertNewSubjectBook,[elem[0], elem[1]]);
            
        } catch (error) {
          console.log('error'+ error);
          console.log(elem);
          
        }
      }))
      console.log("Done adding Subjects");

      console.log("Cleaning up Book Table");
      await executeCommand(scrubTables); // drop unneeded columns from book and publisher table
      console.log("Done Cleaning Book Table");

      console.log("Database has been loaded");
  
    pool.end();
    process.exit(0);

  

  })();


 

 