import { extendObservable } from 'mobx';

/**
 * UserStore
 */
class UserStore{
    constructor(){
        extendObservable(this, {

            loading: true,
            isLoggedIn: false,
            netid: ''

        })
    }
}

export default new UserStore();