class User {

    static instance;

    constructor(id) {
        if (User.instance)
            return User.instance;
        this._id = id
    }

    getId = () => {
        return this._id;
    };

}

export default User;