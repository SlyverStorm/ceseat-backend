//Get user output for prisma request
export const getUserOutput = {
    name: true,
    surname: true,
    email: true,
    phone: true,
    image: true,
    refererCode: true,
    role: {
      select: {
        id: true,
        name: true
      }
    },
    refererUser: {
      select: {
        referentUser: {
          select: {
            name: true,
            surname: true,
            createdAt: true
          }
        }
      }
    },
    referedUsers: {
      select: {
        newUser: {
          select: {
            name: true,
            surname: true,
            createdAt: true
          }
        }
      }
    },
    createdAt: true
}

export const commGetUserOutput = {
  id: true,
  name: true,
  surname: true,
  email: true,
  phone: true,
  image: true,
  refererCode: true,
  role: {
    select: {
      id: true,
      name: true
    }
  },
  refererUser: {
    select: {
      referentUser: {
        select: {
          name: true,
          surname: true,
          createdAt: true
        }
      }
    }
  },
  referedUsers: {
    select: {
      newUser: {
        select: {
          name: true,
          surname: true,
          createdAt: true
        }
      }
    }
  },
  isSuspended: true,
  createdAt: true
}
