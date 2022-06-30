import config from "config";
import { Request } from "express";
import { request } from "http";

export async function getRestaurant(req: Request, restaurantid: string): Promise<any> {

    return new Promise((resolve, reject) => {

        const options = {
            host: config.get<string>("connect.restaurantHost"),
            port: config.get<number>("connect.restaurantPort"),
            path: '/restaurants/' + restaurantid,
            method: 'GET',
            headers: {
                'Cookie': req.headers.cookie
            }
        };

        let restaurant: any = null
        const authReq = request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                if (res.statusCode === 200) restaurant = JSON.parse(chunk);
                resolve(restaurant);
            }
            );
        });
        authReq.on('error', (e) => {
            reject(e);
        })
        authReq.write("");
        authReq.end();
    });

}

export async function getUserRestaurant(req: Request): Promise<any> {

    return new Promise((resolve, reject) => {

        const options = {
            host: config.get<string>("connect.restaurantHost"),
            port: config.get<number>("connect.restaurantPort"),
            path: '/restaurants/me',
            method: 'GET',
            headers: {
                'Cookie': req.headers.cookie
            }
        };

        let restaurant: any = null
        const authReq = request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                if (res.statusCode === 200) restaurant = JSON.parse(chunk);
                resolve(restaurant);
            }
            );
        });
        authReq.on('error', (e) => {
            reject(e);
        })
        authReq.write("");
        authReq.end();
    });

}