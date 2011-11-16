var address = address || {};

/*
 * Model and Collection --
 * both pretty skinny at this point!
 */

address.ContactModel = core.Backbone.Model.extend({});

address.ContactCollection = core.Backbone.Collection.extend({
    model: address.ContactModel,
    
    url: '/async/contact'
});

/* 
 * ContactItemView is for displaying a single item
 */
address.ContactItemView = core.Backbone.View.extend({
    tagName: 'div',

    className: 'contact-row',

    template: _.template('\
        <div class="last"><p></p></div>\
        <div class="first"><p></p></div>\
        <div class="email"><p></p></div>\
    '),

    initialize: function () {
        _.bindAll(this, 'render');
    },

    render: function () {
        this.$(this.el).html(this.template({static_url: static_url}));
        this.$('div.last p').text(this.model.get('last'));
        this.$('div.first p').text(this.model.get('first'));
        this.$('div.email p').text(this.model.get('email'));

        return this;
    }

});

/* 
 * ContactListView is the main block of code that drives the page
 */
address.ContactListView = core.Backbone.View.extend({
    initialize: function () {
        _.bindAll(this, 'reset_collection', 'add_model', 'new_model');
        this.collection = new address.ContactCollection();
        this.collection.bind('reset', this.reset_collection);
        this.collection.bind('add', this.add_model);
        this.collection.fetch();
    },

    events: {
        'submit form': 'new_model'
    },

    reset_collection: function () {
        this.$('#contact-list').empty();
        this.collection.each(this.add_model);
    },

    add_model: function (model) {
        var view = new address.ContactItemView({model: model});
        view.render();
        this.$('#contact-list').append(view.el);
    },

    clear_form: function () {
        this.$('#add-contact input[type="text"]').val('');
        this.$('#add-contact input.last').focus();
    },

    new_model: function () {
        var attrs = {
            email: this.$('input.email').val(),
            last: this.$('input.last').val(),
            first: this.$('input.first').val()
        };
        this.collection.create(attrs);
        this.clear_form();
        return false;
    }
    
});
