export interface User {
    login: string;
    password: string;
    username: string;
    //status: string; // TODO: Вынести это отсюда в отдельный enum {admin, user, etc.}
}