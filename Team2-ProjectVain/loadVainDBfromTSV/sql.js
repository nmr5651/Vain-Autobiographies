const ifDBExists = "SELECT datname FROM pg_catalog.pg_database where datname ='vain_db';"
const createDBs = `
DROP TABLE IF EXISTS public.user;
CREATE TABLE public.user (
 user_id varchar(45) NOT NULL,
  fName varchar(45) NOT NULL,
  lName varchar(45) NOT NULL,
  email varchar(45) NOT NULL,
  password varchar(200) NOT NULL,
  role int NOT NULL,
  PRIMARY KEY (user_id)) ;

INSERT INTO public.user VALUES ('System','System','System','NA','sha1$d840d588$1$e624595497fc366db0822ad8f271298d584f9e67', 1);

DROP TABLE IF EXISTS public.role;

CREATE TABLE public.role (
  role_id SERIAL NOT NULL,
  role varchar(20) NOT NULL,
  PRIMARY KEY (role_id)
);
 INSERT INTO public.role(role) VALUES ('Administrator'),('Contributor'),('User'),('Guest');

DROP TABLE IF EXISTS public.subject;

CREATE TABLE public.subject (
  subject varchar(45) DEFAULT NULL,
  subject_id varchar(2) NOT NULL,
  PRIMARY KEY (subject_id)
);



DROP TABLE IF EXISTS public.type;

CREATE TABLE public.type (
  type_id varchar(2) NOT NULL,
  type varchar(45) DEFAULT NULL,
  PRIMARY KEY (type_id)
);



DROP TABLE IF EXISTS public.book;

CREATE TABLE public.book (
  book_id serial NOT NULL,
  type varchar(2) DEFAULT NULL,
  authorship varchar(2) DEFAULT NULL,
  subject varchar(2) DEFAULT NULL,
  title text,
  year int DEFAULT NULL,
  description text,
  namedPersons text,
  notes text,
  located varchar(450) DEFAULT NULL,
  modifiedBy varchar(45) DEFAULT NULL,
  lastUpdated date DEFAULT NULL,
  publisher text,
  author text,
  PRIMARY KEY (book_id),
  
  CONSTRAINT fk_user FOREIGN KEY (modifiedBy) REFERENCES public.user (user_id)
);

DROP TABLE IF EXISTS public.publisher;

CREATE TABLE public.publisher (
  publisher_id serial NOT NULL ,
  publisher varchar(200) DEFAULT NULL,
  publisherLocation varchar(200) DEFAULT NULL,
publisherfull varchar(200) DEFAULT NULL,
  PRIMARY KEY (publisher_id)
) ;

DROP TABLE IF EXISTS  public.namedPersons;

CREATE TABLE  public.namedPersons (
  author_id SERIAL NOT NULL,
  name varchar(200) DEFAULT NULL,
  lifeYears varchar(20) DEFAULT NULL,
  PRIMARY KEY (author_id)
) ;


DROP TABLE IF EXISTS public.publisher_book;

CREATE TABLE public.publisher_book (
  publisher_id int NOT NULL,
  book_id int NOT NULL,
  PRIMARY KEY (publisher_id,book_id),
  CONSTRAINT fk_publisher_book_id FOREIGN KEY (book_id) REFERENCES public.book (book_id) ON DELETE CASCADE,
  CONSTRAINT fk_publisher_id FOREIGN KEY (publisher_id) REFERENCES public.publisher (publisher_id)
);

DROP TABLE IF EXISTS public.author_book;

CREATE TABLE public.author_book (
  author_id int NOT NULL,
  book_id int NOT NULL,
  PRIMARY KEY (author_id,book_id),
  CONSTRAINT fk_author_book_id FOREIGN KEY (book_id) REFERENCES public.book (book_id) ON DELETE CASCADE,
  CONSTRAINT fk_author_id FOREIGN KEY (author_id) REFERENCES public.namedPersons (author_id));
  
DROP TABLE IF EXISTS public.type_book;

CREATE TABLE public.type_book (
  type_id varchar(2) NOT NULL,
  book_id int NOT NULL,
  PRIMARY KEY (type_id,book_id),
  CONSTRAINT fk_type_book_id FOREIGN KEY (book_id) REFERENCES public.book (book_id) ON DELETE CASCADE,
  CONSTRAINT fk_type_id FOREIGN KEY (type_id) REFERENCES public.type (type_id));

  DROP TABLE IF EXISTS public.subject_book;
CREATE TABLE public.subject_book (
  subject_id varchar(2) NOT NULL,
  book_id int NOT NULL,
  PRIMARY KEY (subject_id,book_id),
  CONSTRAINT fk_subject_book_id FOREIGN KEY (book_id) REFERENCES public.book (book_id) ON DELETE CASCADE,
  CONSTRAINT fk_subject_id FOREIGN KEY (subject_id) REFERENCES public.subject (subject_id));

INSERT INTO public.type VALUES ('A','Autobiography'),('B','Biography'),('C','Compilation'),('D','Diary/Journal'),('F','Fictional'),('G','Broadside'),('L','Letters'),('U','Unknown');

INSERT INTO public.subject VALUES ('Adventure','A'),('Criminal','C'),('Domestic','D'),('Great Man','G'),('Historical','H'),('Literary','L'),('Military','M'),('Politics','P'),('Religious','R'),('Satire','S'),('Travel','T'),('Celebrity','CY'),('Middle-class, MC','MC'),('Social Critique','SC'),('School Days','SD'),('Theatre','TH'),('Unknown','U');
;
`

 
 const insertBook = `INSERT INTO book ( type, authorship, subject, title, year, description, namedPersons, notes, located, modifiedBy, lastUpdated, publisher, author) 
 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,'System', now(), $10, $11)
 `;
const getPubliserFromBook = `SELECT distinct publisher
                                FROM book;`;
const getPubliserWithBookIDFromBook = `SELECT book_id, publisher
                                FROM public.book;`;
const getPubliserWithPublisherIDFromPublisher = `SELECT publisher_id, publisherfull
                                FROM public.publisher;`;
const insertNewPublisher = `INSERT INTO public.publisher ( publisher, publisherlocation, publisherfull) VALUES ($1, $2, $3);`;
const insertNewPublisherBook = `INSERT INTO public.publisher_book ( publisher_id, book_id) VALUES ($1, $2);`;

const getAuthorFromBook = `SELECT distinct author
                                FROM public.book;`;
const getAuthorWithBookIDFromBook = `SELECT book_id, author
                                FROM public.book;`;
const getAuthorWithAuthorIDFromAuthor = `SELECT author_id, name, lifeYears
                                FROM public.namedPersons;`;
const insertNewAuthor = `INSERT INTO public.namedPersons ( name, lifeYears) VALUES ($1, $2);`;
const insertNewAuthorBook = `INSERT INTO public.author_book ( author_id, book_id) VALUES ($1, $2);`;


const getTypeWithBookIDFromBook = `SELECT book_id, type
                                FROM public.book;`;
const insertNewTypeBook = `INSERT INTO public.type_book ( book_id, type_id) VALUES ($1, $2);`;

const getSubjectWithBookIDFromBook = `SELECT book_id, subject
                                FROM public.book;`;
const insertNewSubjectBook = `INSERT INTO public.subject_book ( book_id, subject_id) VALUES ($1, $2);`;

const scrubTables = `ALTER TABLE public.book DROP COLUMN author, DROP COLUMN type, DROP COLUMN subject, DROP COLUMN publisher;  ALTER TABLE public.publisher DROP COLUMN publisherfull`
 

 module.exports = {createDBs, insertBook, getPubliserFromBook, insertNewPublisher, getPubliserWithBookIDFromBook, getPubliserWithPublisherIDFromPublisher, insertNewPublisherBook,
    getAuthorFromBook, getAuthorWithBookIDFromBook, getAuthorWithAuthorIDFromAuthor, insertNewAuthor, insertNewAuthorBook,ifDBExists, 
    getTypeWithBookIDFromBook, insertNewTypeBook,getSubjectWithBookIDFromBook,insertNewSubjectBook, scrubTables};