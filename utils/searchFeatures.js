class SearchFeatures {
  constructor(urlQuery, query) {
    this.urlQuery = urlQuery;
    this.queryResults = query;
  }
  // .filtering()      ==> search for entries with a specific key value or range of values
  // .sorting()        ==> sort search results ex) sort=-price
  // .fieldsLimiting() ==> limite the displayed keys ex) fields=name,price
  // .pagination();    ==> splite results into pages

  filtering() {
    //note const urlQueryObj = this.urlQuery; --> 🛑WRONG
    const urlQueryObj = { ...this.urlQuery };

    const excludedFields = ['page', 'sort', 'limit', 'fields']; //not for searching keys
    excludedFields.forEach((el) => delete urlQueryObj[el]);

    // * advance FILTERING
    let queryString = JSON.stringify(urlQueryObj);
    //adding the $ sign to gte,lte...
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g, //b = this exact word,g = everywhere
      (match) => `$${match}` //note: replace return a callback
    );
    //note: we dont await but we return the query so we can use other methods 'sort,skip..'
    this.queryResults = this.queryResults.find(JSON.parse(queryString));
    return this;
  }

  sorting() {
    //127.0.0.1:8000/api/v1/tours?name=aaa&sort=-price,duration
    if (this.urlQuery.sort) {
      const sortBy = this.urlQuery.sort.split(',').join(' ');
      this.queryResults = this.queryResults.sort(sortBy);
    } else {
      //defualt --> sort by date
      this.queryResults = this.queryResults.sort('_createdAt');
    }
    //NOTE that sort return this so you can chain other methods
    return this;
  }

  fieldsLimiting() {
    // not sending all keys of the data object'

    if (this.urlQuery.fields) {
      const fields = this.urlQuery.fields.split(',').join(' ');

      this.queryResults = this.queryResults.select(fields);
    } else {
      // remove fields that are created by mongoose like (__v) using (-)
      this.queryResults.select('-__v');
    }
    return this;
  }

  pagination() {
    // '/api/v1/tours? page=2 & limit=5'
    // page.1 => 1-5 // page.2 => 6-10 // page.3 => 11-15
    // methods => skip() ,limit()
    const page = +this.urlQuery.page || 1;
    const limit = +this.urlQuery.limit || 100;
    const skipNum = (page - 1) * limit;
    this.queryResults = this.queryResults.skip(skipNum).limit(limit);
    //if user skips all tours
    // if (this.urlQuery.page) {
    //   const numberOfTours = await this.queryResults.countDocuments();
    //   if (skipNum >= numberOfTours) throw new Error('This Page Dose Not Exist');
    // }
    console.log('running');
    return this;
  }
}

module.exports = SearchFeatures;
