export const roles = [
    { id: 1, name: "customer" },
    { id: 2, name: "driver" },
    { id: 3, name: "restaurant" },
    { id: 4, name: "commercial" },
    { id: 5, name: "technical" }
]

export const adminUser = {
    name: "Jean-Michel",
    surname: "ADMIN",
    email: "admin@ceseat.com",
    password: "adminadmin",
    phone: "0566666666",
    roleId: 5,
    refererCode: "admin"
}

export const commUser = {
    name: "Mireille",
    surname: "COMMERCIAL",
    email: "commercial@ceseat.com",
    password: "commercial",
    phone: "0577777777",
    roleId: 4,
    refererCode: "comm"
}

export const customerUser = {
    name: "Default",
    surname: "CLIENT",
    email: "client@viacesi.fr",
    password: "clientsecret",
    phone: "0577788777",
    roleId: 1,
    refererCode: "ADU6CV3Z"
}

export const driverUser = {
    name: "Default",
    surname: "LIVREUR",
    email: "livreur@viacesi.fr",
    password: "livreursecret",
    phone: "0577667777",
    roleId: 2,
    refererCode: "O3LNSU8Q"
}

export const restaurantUser = {
    name: "Default",
    surname: "RESTAURATEUR",
    email: "restaurateur@viacesi.fr",
    password: "restaurateursecret",
    phone: "0577777477",
    roleId: 3,
    refererCode: "NCBWSU61"
}