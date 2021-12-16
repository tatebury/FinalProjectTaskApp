
export const removeMyStoredItems=()=>{
    localStorage.removeItem('currentUserID');
    localStorage.removeItem('token');
    localStorage.removeItem('tasks');
    localStorage.removeItem('totalPoints');
}