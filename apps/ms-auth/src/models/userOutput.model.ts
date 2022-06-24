//Get user output for prisma request
export const getUserOutput = {
    name: true,
    surname: true,
    email: true,
    phone: true,
    image: true,
    role: {
      select: {
        name: true
      }
    },
    refererUser: {
      select: {
        referentUser: {
          select: {
            name: true,
            surname: true,
          }
        }
      }
    },
    ReferedUsers: {
      select: {
        newUser: {
          select: {
            name: true,
            surname: true,
          }
        }
      }
    }
}

export const commGetUserOutput = {
  id: true,
  name: true,
  surname: true,
  email: true,
  phone: true,
  image: true,
  role: {
    select: {
      name: true
    }
  },
  refererUser: {
    select: {
      referentUser: {
        select: {
          name: true,
          surname: true,
        }
      }
    }
  },
  ReferedUsers: {
    select: {
      newUser: {
        select: {
          name: true,
          surname: true,
        }
      }
    }
  }
}
