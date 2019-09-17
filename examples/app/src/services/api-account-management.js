const mock_results = [
  {
    "id": 0,
    "username": "0.6359557700939702",
    "roles": [
      "0",
      "0"
    ],
    "auth": [
      "series",
      "series"
    ]
  },
  {
    "id": 1,
    "username": "0.6359557700939702",
    "roles": [
      "0",
      "0"
    ],
    "auth": [
      "series",
      "series"
    ]
  },
  {
    "id": 2,
    "username": "0.6359557700939702",
    "roles": [
      "0",
      "0"
    ],
    "auth": [
      "series",
      "series"
    ]
  },
  {
    "id": 3,
    "username": "0.6359557700939702",
    "roles": [
      "0",
      "0"
    ],
    "auth": [
      "series",
      "series"
    ]
  },
  {
    "id": 4,
    "username": "0.6359557700939702",
    "roles": [
      "0",
      "0"
    ],
    "auth": [
      "series",
      "series"
    ]
  },
  {
    "id": 5,
    "username": "0.6359557700939702",
    "roles": [
      "0",
      "0"
    ],
    "auth": [
      "series",
      "series"
    ]
  },
  {
    "id": 6,
    "username": "0.6359557700939702",
    "roles": [
      "0",
      "0"
    ],
    "auth": [
      "series",
      "series"
    ]
  },
  {
    "id": 7,
    "username": "0.6359557700939702",
    "roles": [
      "0",
      "0"
    ],
    "auth": [
      "series",
      "series"
    ]
  },
  {
    "id": 8,
    "username": "0.6359557700939702",
    "roles": [
      "0",
      "0"
    ],
    "auth": [
      "series",
      "series"
    ]
  },
  {
    "id": 9,
    "username": "0.6359557700939702",
    "roles": [
      "0",
      "0"
    ],
    "auth": [
      "series",
      "series"
    ]
  }
]

const mock_lag = 1000


let total = mock_results.length




export async function createAccountManagement({...obj}) {
    mock_results.push(obj)
    total += 1
    return new Promise(resolve => {
        setTimeout(()=>{
            resolve({
                msg: "success"
            });
        }, mock_lag)
    });
 }
 export async function updateAccountManagement({id, ...props}) {
    const _index = mock_results.findIndex(r => r.id === id)
    mock_results[_index] = {...mock_results[_index], ...props}

    return new Promise(resolve => {
        setTimeout(()=>{
            resolve({
                data: {
                    msg: "success"
                }
            });
        }, mock_lag)
    });
 }
 export async function  retrieveAccountManagementList({page = 1, pageSize = 3, ...queries}) {

    const sub_mock_results = mock_results.filter(v => {
        const keys = Object.keys(queries)
        for (let i = 0; i < keys.length; i+=1) {
            const key = keys[i];
            console.log(v, queries, key, v[key], queries[key])
            if ((key in v) && (v[key] !== queries[key])) {
                return false
            }
        }
        return true
    })
    const _total = sub_mock_results.length
    const start = page * Math.floor(_total / pageSize)

    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                data: {
                    results: sub_mock_results.slice(start, start + pageSize),
                    page_count: page,
                    count: _total,
                }
            });
        }, mock_lag)
    });
 }
 export async function deleteAccountManagement() {
    const _index = mock_results.findIndex(r => r.id === id)
    mock_results.splice(_index, 1)
    total -= 1
    return new Promise(resolve => {
        setTimeout(()=>{
            resolve({
                data: {
                   msg: "success"
                }
            });
        }, mock_lag)
    });
 }