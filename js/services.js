app.service('Notification', function () {
    var property = '';
    return {
        get: function () {
            return property;
        },
        set: function(value) {
            property = value;
        }
    };
});
