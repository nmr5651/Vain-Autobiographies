



[{"book_id":1,
"authorship":"N",
"title":"A Narrative of the Life of James Downing [In verse], a Blind Man, Late a Private in His Majesty''s 20th Regiment of the Foot, Containing Historical, Naval, Military, Moral, Religious and Entertaining Reflections. Composed by Himself in Easy Verse.",
"year":1811,
"description":"1 vol and 143 pp; apparently real autobiography; republished in 1815 and 1817 in England and in 1821 in New York",
"namedpersons":"Unknown",
"notes":"Unknown",
"located":"Unknown",
"modifiedby":"System",
"lastupdated":"2021-11-11T05:00:00.000Z"}]


module.exports = function(){
    var faker = require("faker")
    var _ =require("lodash")

    return{

        books: _.times(2000, function(n) {
            return{
                book_id:n,
                authorship:_.sample(["Y","N"]),
                title: faker.lorem.sentences(3),
                year:_.sample(["1855","1866","1824"]),
                description: faker.lorem.sentence(2),
                namedpersons:faker.name.findName(),
                notes: faker.lorem.sentences(2),
                located: faker.lorem.words(4),
                modifiedby: faker.name.firstName(),
                lastupdated: "2021-11-11T05:00:00.000Z",
                type:faker.lorem.word(10),
                subject:faker.lorem.word(10),
                name:faker.name.findName(),
                lifeyears:_.sample(["1852-1855","1866-1876","1822-1844"]),
                publisher: faker.lorem.words(2),
                publisherlocation: faker.lorem.word(8)
                

            }

        }),
        authors: _.times(2000, function(n) {
            return{
                author_id:n,
                authorship:_.sample(["Y","N"]),
                title: faker.lorem.sentences(3),
                year:_.sample(["1855","1866","1824"]),
                description: faker.lorem.sentence(2),
                namedpersons:faker.name.findName(),
                notes: faker.lorem.sentences(2),
                located: faker.lorem.words(4),
                modifiedby: faker.name.firstName(),
                lastupdated: "2021-11-11T05:00:00.000Z",
                type:faker.lorem.word(10),
                subject:faker.lorem.word(10),
                name:faker.name.findName(),
                lifeyears:_.sample(["1852-1855","1866-1876","1822-1844"]),
                publisher: faker.lorem.words(2),
                publisherlocation: faker.lorem.word(8)
                

            }

        }),
        publishers: _.times(2000, function(n) {
            return{
                book_id:n,
                authorship:_.sample(["Y","N"]),
                title: faker.lorem.sentences(3),
                year:_.sample(["1855","1866","1824"]),
                description: faker.lorem.sentence(2),
                namedpersons:faker.name.findName(),
                notes: faker.lorem.sentences(2),
                located: faker.lorem.words(4),
                modifiedby: faker.name.firstName(),
                lastupdated: "2021-11-11T05:00:00.000Z",
                type:faker.lorem.word(10),
                subject:faker.lorem.word(10),
                name:faker.name.findName(),
                lifeyears:_.sample(["1852-1855","1866-1876","1822-1844"]),
                publisher: faker.lorem.words(2),
                publisherlocation: faker.lorem.word(8)
                

            }

        })
        
        
    }
}