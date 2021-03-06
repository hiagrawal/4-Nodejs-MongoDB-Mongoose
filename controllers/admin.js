const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  //when using mongodb
  // const product = new Product(title, price, description, imageUrl, null, req.user._id);
  // product.save()
  //   .then(result => {
  //     console.log(result);
  //     console.log('Created Product');
  //     res.redirect('/admin/products');
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });

    //when using MOngoose
    //for userId, we can give req.user._id to pass just the id, 
    //or we can give only req.user and mongoose will automatically take the id from the user and assign it to userId
    const product = new Product({
      title:title, 
      price: price, 
      description: description, 
      imageUrl : imageUrl,
      userId: req.user
    });
    //Note we did not define a method 'save' in model. It is given ny mongoose 
    product.save()
    .then(result => {
      console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });

};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  //when using mongo
  // const product = new Product(updatedTitle, updatedPrice, updatedDesc, updatedImageUrl, prodId);
  // product.save()
  //   .then(result => {
  //     console.log(result);
  //     console.log('Updated Product');
  //     res.redirect('/admin/products');
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });

  //when using mongoose
  //when we do findById, it not only gives us product object but also all mongoose methods on that object
  //so we can directly call save method on the returned object
  Product.findById(prodId).then(product => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
    return product.save()
  })
    .then(result => {
      console.log(result);
      console.log('Updated Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {

  //when using mongo
  // Product.fetchAll()
  //   .then(products => {
  //     res.render('admin/products', {
  //       prods: products,
  //       pageTitle: 'Admin Products',
  //       path: '/admin/products'
  //     });
  //   })
  //   .catch(err => console.log(err));

  //when using mongoose
  Product.find()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));

    //other userful methods provided by mongoose
    //we can give select to define what all paramters should be returned by passing the paramter name
    //and what should not be returned by passing '- (minus)' and then the paramter name
    //since id is returned automatically if not excluded explicitely 
    //and since we have not passed imageUrl and description so it will not be returned in the result

    //another is populate which can be used to populate all the paramters of a relational paramter
    //by default just the userId will be returned but if we want enter user object matching that userId we can use populate
    //and it will return name email and the entire user object
    //if we want t populate fields bt not all and some specific we can give that as well like name
    
    // Product.find()
    // .select('title price -.id')
    // .populate('userId', 'name')
    // .then(products => {
    //   res.render('admin/products', {
    //     prods: products,
    //     pageTitle: 'Admin Products',
    //     path: '/admin/products'
    //   });
    // })
    // .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  //when using mongo
  // Product.deleteById(prodId)
  //   .then(() => {
  //     console.log('DESTROYED PRODUCT');
  //     res.redirect('/admin/products');
  //   })
  //   .catch(err => console.log(err));

  //when using mongoose
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
