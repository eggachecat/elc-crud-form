/*
const mock_results = [
    {
  "username": "0.3553615438939901",
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
  "username": "0.3553615438939901",
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
  "username": "0.3553615438939901",
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
  "username": "0.3553615438939901",
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
  "username": "0.3553615438939901",
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
  "username": "0.3553615438939901",
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
  "username": "0.3553615438939901",
  "roles": [
    "0",
    "0"
  ],
  "auth": [
    "series",
    "series"
  ]
},
]
*/

const mock_results = [
  {
    "id": 0,
    "username": "0.3553615438939901",
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
    "username": "0.3553615438939901",
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
    "username": "0.3553615438939901",
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
    "username": "0.3553615438939901",
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
    "username": "0.3553615438939901",
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
    "username": "0.3553615438939901",
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
    "username": "0.3553615438939901",
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
    "username": "0.3553615438939901",
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
    "username": "0.3553615438939901",
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
    "username": "0.3553615438939901",
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
 export async function  retrieveAccountManagementList({page = 1, pageSize = 3}) {
    const start = page * Math.floor(total / pageSize)
    return new Promise(resolve => {
        setTimeout(()=>{
            resolve({
                data: {
                    results: mock_results.slice(start, start + pageSize),
                    page_count: page,
                    count: total,
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