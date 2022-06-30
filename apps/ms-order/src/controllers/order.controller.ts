// export async function createArticleHandler(req: Request<{}, {}, CreateArticleInput["body"]>, res: Response) {

//     const userid = res.locals.user.id;
//     //const userid = "user_adminadmin";

//     const restaurant = await getRestaurant({userId: userid});
//     if (restaurant === null) return res.sendStatus(403);

//     const data = req.body;
//     const article = await createArticle({...data, restaurantId: restaurant._id});
//     if (restaurant.articles) {
//         await updateRestaurant({_id: restaurant._id}, {$push: {articles: article._id}}, {new: true});
//     }
//     else {
//         await updateRestaurant({_id: restaurant._id}, {articles: [article._id]}, {new: true});
//     } 
//     return res.send(article);
// }