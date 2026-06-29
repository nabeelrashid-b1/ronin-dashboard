import axios from "axios";


const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTVVBFUkFETUlOIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlNVUEVSQURNSU4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJzdXBlcmFkbWluQHJvbmluLmxvY2FsIiwicm9sZSI6IlJPTEVfU1VQRVJBRE1JTiIsInJvbGVfbmFtZSI6IlN1cGVyIEFkbWluaXN0cmF0b3IiLCJwZXJtaXNzaW9uIjpbIkFETUlOLlJPTEVTIiwiQURNSU4uVVNFUlMiLCJDTEFJTVMuQVBQUk9WRSIsIkNMQUlNUy5WSUVXIiwiQ0xBSU1TLldPUktTSE9QIiwiQ09ORklHLkVESVQiLCJDT05GSUcuVklFVyIsIkRJU1BBVENILkZJTkFMSVpFIiwiRElTUEFUQ0guT1VUTEVUX1VQREFURSIsIkRJU1BBVENILlJPTExCQUNLIiwiRElTUEFUQ0guVklFVyIsIlJFVFVSTlMuUFJPQ0VTUyIsIlJFVFVSTlMuVklFVyIsIlNFUklBTFMuQ1JFQVRFIiwiU0VSSUFMUy5FWFBPUlQiLCJTRVJJQUxTLlZJRVciXSwiZXhwIjoxNzgyNzQzODYyLCJpc3MiOiJST05JTl9XTVNfQVBJIiwiYXVkIjoiUk9OSU5fV01TX1BPUlRBTCJ9.92keETP9641SiJuO1dW-HVahmHRsvCnbNxsKcFdXKCw";

export const fetchUsers = async ({ page, pageSize }: any) => {
  const res = await axios.get(
    `https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=${pageSize}`
  );
  return res.data;
};

export const fetchItems = async ({ page, pageSize }: any) => {
  const res = await axios.get(
    `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${pageSize}`
  );
  return res.data;
};

export const fetchSerials = async ({ page, pageSize }: any) => {

  try {
    const res = await axios.get(
      `http://192.168.19.16:9002/serial-masters?page=${page}&pageSize=${pageSize}`,
      {
       headers: {
      Authorization: `Bearer ${token}`,
    },
  }
    );
    console.log('tokensssss','token')

    console.log('kkkkk', res.data)
    // return res.data;

    /// CUSTOM 
    return {
    "items": [
        {
            "code": "1000041184",
            "serialNo": "1000041184",
            "itemCode": "ADV-000018",
            "itemName": "Reflat (Retail)",
            "batchNumber": "03462",
            "color": "White",
            "printDate": "2026-06-24T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADxElEQVR4nO3dUW7jMAwE0Nyg979lb+AFiriSRlSyu5/h00fh2NLIGJAzoC2rj0e2r+u6ru/56Jraz4XH89w4Gj/fNOiYETOyiRLQyA93jx+Q0eP++QL963l1nuc+l5NBx4yYkU2UgEa2c4/hsDPmAhyThTHHjNMRdMyIGdlECWgk9xhF76iLo93W+3++Ch0zYkY2UQIa2cY94tyYrJq7qpChY0bMyCZKQCM7u0f1uDe6zUX8fhfxhPrNM2zomBEzsokS0MjPdY9oMfSf/rxv0DEjZmQTJaCRH+0exfPjXJQU75tnT49+0b6hY0bMyCZKQCM7usdw2Ap49t/DA+Z41AwdM2JGNlECGtnUPaKOnT+xqZY8LePD07dhywF0zIgZ2UQJaGQL9zgUuFsNPFe5+w0sI+ar0DEjZmQTJaCRjdxjtt8YfyyO9zI5a+C7C3TMiBnZRAloZC/3CEvekIaJj4XGo8sC935pFHTMiBnZRAloZBv3iKPnz1c2HYXwmLZwbeiYETOyiRLQyEbuUa1xipe54dqHQrjoBx0zYkY2UQIa2cs9jiVxePBWMFd7TUSZDB0zYkY2UQIa2cg9ttXB1dTVGuP4WHZ/ygwdM2JGNlECGtnUPepHyI/3WyUeNmz6nRs6ZsSMbKIENLKbe9wOPY9afDmA6293YteJdaExdMyIGdlECWhkG/eI/4u+jN/sfL+fGDYf/VbD0DEjZmQTJaCRvdwjSuLFxCuk2thjBHTMiBnZRAloZDf3eGHJw7r3z3bqN7r1mmXomBEzsokS0MhG7vHKfis3rrpUK6WgY0bMyCZKQCP7ucew6a1HtUtinFvuZ4OCjhkxI5soAY3s5h7zxXpl03m1cbR52LqnBXTMiBnZRAloZBP3eLF2+PjZzrLDU+Xzv0fQMSNmZBMloJEt3SOOrhevZqv7CRNP14aOGTEjmygBjWziHmtZPE1Rndumjfe4sTT5+W4YOmbEjGyiBDSyjXuMbs8Wy4ujyt0tfmvrN0LQMSNmZBMloJHt3CNaae55brlwWjMFHTNiRjZRAhrZyz0q0w3/3rx6gRv3Ez5fGjt0zIgZ2UQJaOSHu8ferTbnw5c9cSvZDzpmxIxsogQ0sp17zH0X9IEzD13WR20zbntaQMeMmJFNlIBGtnaPep5DvTub/V+5NnTMiBnZRAloZDf32Ddo2lx7uTBb97oPMXTMiBnZRAloZDv3mHscNnKqSuL5KD6lveeGjhkxI5soAY1s5h7RYqfDauuJ3b+3ezw16JgRM7KJEtDI64OV4A8QaHvxahe9qgAAAABJRU5ErkJggg=="
        },
        {
            "code": "1000183745",
            "serialNo": "1000183745",
            "itemCode": "TS-000122",
            "itemName": "Choran Chatni (2.5)",
            "batchNumber": "0344",
            "color": "White",
            "printDate": "2026-06-23T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADwklEQVR4nO3dUW7jMAwE0Nyg979lb5AFiriUSNpJ99N8+mgTOx4JA3IGkmn58cjt6/n8+f98fr+OPPcWx9LZxwcNOmbEjGyiBDTy5u7xtV96oK+forOfH0e3x6fXjxMUdMyIGdlECWjkSPdIv+iAo+/X1zgWJt6MDDpmxIxsogQ0crp7FF8ONz4wo4t+UNAxI2ZkEyWgkdxj99WDjzTVLXPl//NV6JgRM7KJEtDIu7pHWWWOSe++ZpyvqLOyT9awoWNGzMgmSkAj7+seqSUP/tOf9w06ZsSMbKIENPLW7rH67LV1xw3VYxTltm5q39AxI2ZkEyWgkRPdozPs1E9nzuu1/THomBEzsokS0MhZ7rECR2XxVuybzDn1fVEjDB0zYkY2UQIaOc09ug7TvLh7puZ6sL/WDR0zYkY2UQIaOcs9wqtPF4772XB9KqmMDDpmxIxsogQ0cqR7rEjxNe7UdvtKBFIqOW4adMyIGdlECWjkEPcohU5humnlOZASerRUOAUdM2JGNlECGjnPPTq4zY3jbJo1r62vT4aOGTEjmygBjZzlHsm/135Oi483i+/MHjpmxIxsogQ0crJ7nAKnCW5c9UEx1fthQ8eMmJFNlIBG3s89Tl43cPGy1237xNLFPmGGjhkxI5soAY2c5B4JuNhvMvaTbsszPr8TYeiYETOyiRLQyEnuUa6/3iUxDaV6egwPOmbEjGyiBDRyonukB3i2k9c9hn83Nr2ehI4ZMSObKAGNHOIe/UQ47ZKYbusemF0tcl5lho4ZMSObKAGNHOce6wXVdcux09XoVHfcL0tDx4yYkU2UgEbe1z3SoXIbdmtpFKudb31Dx4yYkU2UgEYOdY8L4Po1LTp3fe/Fx9AxI2ZkEyWgkbPcY20Vs0yE09m66FzWm6FjRszIJkpAI0e5Rypquq57ql69unazSyJ0zIgZ2UQJaOQ491gXjt/erl1roepSM3TMiBnZRAloJPdoJ7jd9LeuS6/uXp04A0PHjJiRTZSARt7aPfppbf1tmu92q8xlSry+iwc6ZsSMbKIENHKCe5SWVooPc+5MPHVbjB06ZsSMbKIENHKee5y8RC46KyVPV++ea6uioGNGzMgmSkAjJ7lHQereKXdSY1ysfy9Sho4ZMSObKAGN5B7pcZyTKuDrs+e+Ch0zYkY2UQIaOc49ylS3bC28tHVPir1SCjpmxIxsogQ0cpx7FKTDkk+fjl2tO65tljyhY0bMyCZKQCNnuUdq3QaJdUuJ1au7m7lnDTpmxIxsogQ08nljJfgHuyeyy4dNEZsAAAAASUVORK5CYII="
        },
        {
            "code": "1000185889",
            "serialNo": "1000185889",
            "itemCode": "ADV-000018",
            "itemName": "Reflat (Retail)",
            "batchNumber": "03462",
            "color": "White",
            "printDate": "2026-06-24T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADw0lEQVR4nO3dUW7jMAwE0N5g73/L3iALLJyKIimn+2s+fRhOZY8MYjhTSorz9ZXbn9fr3+Fq36UjHtJtnxt0kcEZ2UQJaOTD3WMhveJd18fuuu/Su+6NUNBFBmdkEyWgkSPdoxj2+/6C9L4/nRUn/zmDLjI4I5soAY2c7h7Jq9eIy6F7YOgigzOyiRLQSO7R+Go31bzs/Lsx3P/xVegigzOyiRLQyEe7R/fvVVm43UrVY0nczDJDFxmckU2UgEYOco/Uuqnd3x4+N+gigzOyiRLQyEe7x+vctgXVVOp2y60NAHSRwRnZRAlo5Ej3WJufaiFc5pZXR9pjvEa8zqCLDM7IJkpAIwe6R7dc25/VldrVcUGtSvhybegigzOyiRLQyFnu0d9Vrg1nyed7O48PBl1kcEY2UQIaOcY9ugK3jFPr4uN3Wn8eGbrI4IxsogQ0cpZ7REveCtxi2HU/cYLr5puhiwzOyCZKQCPnuUesct+d6VAuTsAHFOgigzOyiRLQyFHuEYdJC7KpBq4vI15nsUJ+XwddZHBGNlECGjnUPSJmVxdXc07jdPuTg7lDFxmckU2UgEYOcY/jmyOWa6eO5ORpu1QEhS4yOCObKAGNnOYeyZc7E0/bi4/FcfwbdJHBGdlECWjkUPe4+yW5hBQfoSDVuhi6yOCMbKIENHKee6T54fqNnfQA6bs7J+Br9Ra6yOCMbKIENHKSexRzrlPIaVm3FMKdde+/xQNdZHBGNlECGjnEPWJtW706Vb43u5J764YuMjgjmygBjZzmHl29m5Zw04xy93aKvkyGLjI4I5soAY2c5R6xM9l0LXBjq0jR+7dLoIsMzsgmSkAjp7hHKnDPy7D5bD3FZud7B3SRwRnZRAlo5DT3uHtlf9katT1ANOz+x3OgiwzOyCZKQCNnuUe/K+q476lOJvfblW93G0MXGZyRTZSARj7VPW6Au5nn6sQR7j3Yz4jQRQZnZBMloJGz3KP4cl2QXWOnS+KIG0rbAV1kcEY2UQIa+Xz3KM68bYiKdp7cuJuX3i6GLjI4I5soAY2c5x696aZSd9ue3BXC0dPrbDR0kcEZ2UQJaOQc90hbhA/f50mYvVefdkVBFxmckU2UgEZOco/kvKnK7eviuy1U4W/QRQZnZBMloJHT3SOWyt1OqY8vIw6XQBcZnJFNlIBGTneP8sXYw6FMPzdODl1kcEY2UQIaOc49Vrv52K3ZVoA47KfVW+gigzOyiRLQyOe5R2oV/Spw1617vRt699dZdA26yOCMbKIENPL1YCX4C+RD5WkD8guDAAAAAElFTkSuQmCC"
        },
        {
            "code": "1000279426",
            "serialNo": "1000279426",
            "itemCode": "ADV-000018",
            "itemName": "Reflat (Retail)",
            "batchNumber": "03462",
            "color": "White",
            "printDate": "2026-06-24T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADxUlEQVR4nO3dUY4iMQwEUG4w978lN+iV2IE4tgOaX/zygXZIU2mV7Kp1Oknfbrn9XNd13W+369Ue3z36fr+4x4vjx+cGHTNiRjZRAhr55e7xgNuQIubqfWBuSOUGEhR0zIgZ2UQJaORI9+g8OA62gB+YT9fu/XsHhY4ZMSObKAGN5B6bVy9fDW784miVzn/2VeiYETOyiRLQyAnuESvSrbaNdfEaYquGoWNGzMgmSkAjx7tHmWWuNp0Mu9T013mWGTpmxIxsogQ0cpB7pJYWOv3p43ODjhkxI5soAY38ave42rZce1ujVNx9mfNPiwIdM2JGNlECGjnSPdKK3/TItD487R6yNncGHTNiRjZRAho5yz1i57YCKhbHaR65WwvVbardh4aOGTEjmygBjfx+9yhwyZe77azLnFPbxoaOGTEjmygBjZznHmuI/iMtb3rv/6dHuNAxI2ZkEyWgkWPco5tCrlXu8VbWd7F3P80JOmbEjGyiBDRyiHss541Vbn1wm1rBXB3RuqFjRszIJkpAI6e5R7eK+P72p8dnu9us9f81V9AxI2ZkEyWgkZPc42jdabD+us3ny5/QMSNmZBMloJEj3SN68DLisrxpW5Xc3UWphqFjRszIJkpAI6e5x9GXu/nmVPmmi5sNQdAxI2ZkEyWgkZPc47gdJ12bpp/j2PUXrz+hY0bMyCZKQCNnuUeaH16WXBz68D66cgPPBh0zYkY2UQIaOdE96ntVr1Nb43Rlcpqhho4ZMSObKAGNHOoe0ZcPrz9fHd11vXU3RzpBx4yYkU2UgEZ+uXsczpUoHd1BiofT/8PPoGNGzMgmSkAjJ7lHKYTTsUx1yXFBf3MxdMyIGdlECWjkNPeovtyXus9WJpPTCYvNOwOgY0bMyCZKQCOHuEesXuvJEQlp9UbD7l5F1+wRgo4ZMSObKAGNnOAetXJ9s+7p43PcYtbQMSNmZBMloJGj3KMe3xSt+3ntAi418LbbJz/ChY4ZMSObKAGNHOceqTOtioq92yXdOOk/ANAxI2ZkEyWgkaPc42ra6sh3cp6I7u8ROmbEjGyiBDRylnuUVp/Z9v57/zwbDR0zYkY2UQIaOc890tGGyX67RcWdLx829UDHjJiRTZSARs5zj86wy3zz8urnv5Kxt8NCx4yYkU2UgEZyj2SJadL54+vUw2/f+Sp0zIgZ2UQJaOQE9yi16dV/FyvfUw0LHTNiRjZRAho5zj2S3x6nlQvchhnxoGNGzMgmSkAjh7pHat3enbptp7uf1AsdM2JGNlECGnlNU4J/kMuxKz5HVKwAAAAASUVORK5CYII="
        },
        {
            "code": "1000353643",
            "serialNo": "1000353643",
            "itemCode": "ADV-000003",
            "itemName": "T-Shirt XL (Blue)",
            "batchNumber": "00125",
            "color": "BLACK",
            "printDate": "2026-06-22T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADyUlEQVR4nO3dS3LjMAyE4dwg97/l3CBTSSVDsgEpXsxK+Lhw/JBbKhTQf/gw9faW7f3j4+vvx2dbz/aXf24+/aVRFxk5o5o4AY98OD3e1+efR/yoR/vSvHz2/bWQoi4yckY1cQIeOZIeccT+EJj++v6fHt1FirrIyBnVxAl4JHp8k3MxdKfxD00XXDsS33KVusjIGdXECXgkeiy4Jjn/h0dSFxk5o5o4AY98ED3KKPMa7r2Yml2d1lB/ZQybusjIGdXECXjkc+kRrZtkffXh90ZdZOSMauIEPPLR9Ng5e4HuWK3UTbcGsP99Sl1k5Ixq4gQ8ciA9OmDHeQLOsR44ON2+oi4yckY1cQIe+Xx6xKzs/iOaAPblGHR3njJ7S11k5Ixq4gQ8cgI9ygxsbCSxusQH2ON6OgHqIiNnVBMn4JHz6BFHdAPHIbxedtTer4y6yMgZ1cQJeORQesRbldXrjJ36i0ujqIuMnFFNnIBHPpwe+56HRysztWvkuV7Uzu/9EOoiI2dUEyfgkdPo0ckFv+vUbJznalqXusjIGdXECXjkLHqUb12sMY4LiPfiGqmLjJxRTZyAR06mR7fuaWdwdJjrguT903LPHeoiI2dUEyfgkYPoUfeLKL3ci4VTO5wvjqMuMnJGNXECHjmKHjuI66qoHdgxNVvndgP2iXnqIiNnVBMn4JHPp8dq3WHlAuKW5sHqJVW2eaIuMnJGNXECHjmDHnXd0/rqpVKH+LZRFxk5o5o4AY+cRY+DskHoONn9cqnA/tnhpi4yckY1cQIeOYYeC78FuJXGMS4d597fK/8dUBcZOaOaOAGPfDw9YlVUTMMerTtP102mLjJyRjVxAh45lB5L82Zl09HVXZrduc/Fx9RFRs6oJk7AI2fRY1c6nu2d4+4nOnUTiu5SqIuMnFFNnIBHTqRH9wOebt1TZfVO7WaXROoiI2dUEyfgkePoUbh8tHXsLnKsoyoq1EVGzqgmTsAjx9Oj3kmu32ZitaD7QeLtW/FAXWTkjGriBDzyqfTou7Vdf/Xo73YD0aVLvN+Lh7rIyBnVxAl45AR6lNbdBefyjnPHadtxYOoiI2dUEyfgkbPo0d1E7mK/xP7cMefar4qiLjJyRjVxAh45hh5B47Ke+HLDim6DxHPvCuoiI2dUEyfgkehx/ES2o/FLa4RvuEpdZOSMauIEPHIWPaK/er+18H7ac6UUdZGRM6qJE/DIcfTohou73ZxibPdmMdW5mxN1kZEzqokT8Mgx9IjWbZDYTdfG/ei62VfqIiNnVBMn4JHvs5zgLyVaErj+2WjFAAAAAElFTkSuQmCC"
        },
        {
            "code": "1000471360",
            "serialNo": "1000471360",
            "itemCode": "ADV-000018",
            "itemName": "Reflat (Retail)",
            "batchNumber": "03462",
            "color": "White",
            "printDate": "2026-06-24T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADwklEQVR4nO3dWW7jMBAE0Nxg7n/L3EADGBORvYie/LofPwzbMotCobvKXPX1lcuf67qu7/vddV2vd69r/7743n+8v7wv0DEjZmQTJaCRH+4ePyALacdcV0OLr4+pWoGCjhkxI5soAY0c6R6dB+8g371D9/4dQaFjRszIJkpAI7nH6hLXbnL/cv3WV6FjRszIJkpAI4e4x2GUeSH9lNQbho4ZMSObKAGNHO8eZZQ5DPwWN63jwGmE+s0YNnTMiBnZRAlo5Oe6RyppGvVXL+8LdMyIGdlECWjkR7vH1Za0UCkMAaeybqpBgY4ZMSObKAGNHOkeC271bav1lsZCbzhBQceMmJFNlIBGznOPfuA4LDtI22n6bTdPu3igY0bMyCZKQCMnuUfZ5rq8Ok3h/sf8bJnWhY4ZMSObKAGNnOUe6eJhd05qorup4wQxdMyIGdlECWjkBPfoerQBeNVPze6jzOHd1iJ0zIgZ2UQJaOQk9+j7wKnZum44efN+Ybdu6JgRM7KJEtDIae5R52K7JU+pN7zfQLjHvOYKOmbEjGyiBDRyknskry7m/HDm/17qcf/QMSNmZBMloJGT3SOZc+rqltnb8Dy61OzTBDF0zIgZ2UQJaOQE99it9vG4w9BNTvfTAdzdaeiYETOyiRLQyIHu0fv3+pgeb/Owi7bxfuiYETOyiRLQyGnuEdYOJw9eSIcVyKvG8dQJ6JgRM7KJEtDICe6xysMzcvYKnTl31n1PC0PHjJiRTZSARo5zj7M5p+206ScH695HmaFjRszIJkpAIye4R3TZfCLT42bZw6aeZqExdMyIGdlECWjkEPfodsLu351O9U9OXu4HOmbEjGyiBDRymnvspV/ZFDrHdVq32/fTNgEdM2JGNlECGjnJPe7B4efnzPWDznWjT/orAB0zYkY2UQIaOco9ugqHWsHE0+/WHwDomBEzsokS0MiJ7lG/Kp3ZdDZi7QPvLcauM3TMiBnZRAlo5Dj3WIad3Lhs5QkzuodR5vvH0DEjZmQTJaCRk9wj+vFmuvvsbdo2m6y7nk183wB0zIgZ2UQJaOQs9yglYPbAy867Wd5l3dAxI2ZkEyWgkfPco3vOXNrZc97Psz7WAyygY0bMyCZKQCPnucdu2GnvTkBKw8+99cdmoWNGzMgmSkAjuUc1yN1mH64m7z/6KnTMiBnZRAlo5Bj3KJ3jVDVUe/MvBDpmxIxsogQ0cpx7FLiHYeWyFjlgdnYOHTNiRjZRAho5zD1SSadJPJ5IXO8nXYWOGTEjmygBjbymKcFfsDdTLDb7ypYAAAAASUVORK5CYII="
        },
        {
            "code": "1000502995",
            "serialNo": "1000502995",
            "itemCode": "IN-002788",
            "itemName": "R-520 (White)",
            "batchNumber": "10002",
            "color": "White",
            "printDate": "2026-06-23T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADvUlEQVR4nO3dUW7jMAwE0Nyg979lb+AFgiaiSMrd/oZPH0Ec2yNjQM6Ukqw+Hrl9Xdd1fT8e17s9f3uee55IF8eP3xt0zIgZ2UQJaOSHu8cTLiGlG1aPq9vVz3ZHhIKOGTEjmygBjRzpHv1lL7jOhMsl9XmgY0bMyCZKQCO5x8lcgxGfqt6/+Cp0zIgZ2UQJaOQg93jsRW8deY4n6mg0dMyIGdlECWjkZPforoiG/RoMjt+Sif9lDBs6ZsSMbKIENPJz3SO1WhL//8fvDTpmxIxsogQ08qPdI/psV+pW6163/XyrdfEbBTpmxIxsogQ0cqB7LKRi3a/DHmTruzwAdMyIGdlECWjkPPfYXswph9twcfLqzuf3FVXQMSNmZBMloJHT3KM7mVpdLtWXxGVjCuiYETOyiRLQyGnuUSvam866BcmpRduHjhkxI5soAY2c5R7d8qZYCK8Nlg4m3Ln2ugM6ZsSMbKIENHKYe9S3c/pVUeuG+gLtbYUMHTNiRjZRAho5xj1y9doMJpf1Udsuxd2CKOiYETOyiRLQyMnusaw71cAF6bDxfzwRnww6ZsSMbKIENHKWeyRLLs6bOtvmdkvbimjomBEzsokS0Mih7lEGkw9F77HbbtIXOmbEjGyiBDRynnv8HK2WgNN+Td2C5M3xoWNGzMgmSkAjJ7tHNw2bFkmVLrZWpnC30hk6ZsSMbKIENHKUe8Qr6sRtuv+IVJ7xPTcMHTNiRjZRAho5zj3S0qh4VyqTt+0o4r03tTZ0zIgZ2UQJaORA9yjzs2mHifRST93pP403Q8eMmJFNlIBGznOPiHS3bLicrUjpUd7XQceMmJFNlIBGjnGPVOAupHTYV77HpVH7NlHQMSNmZBMloJFj3GPb3zBZcr+yeJ3t9qSAjhkxI5soAY2c6x6rdcDHb71rH/GgY0bMyCZKQCNnuMdy3uTaZeK2Fsxl3XGZzIWOGTEjmygBjZzlHsWmD2/ClvK32WHihAcdM2JGNlECGjnFPSJCQqqrjW86uxnDho4ZMSObKAGNHOMend8eJ24jfjq71crnLqBjRszIJkpAIz/cPWrRW+rdre+E2Y0t5zIbOmbEjGyiBDRyknsUw375cvTq+p5stfzSD3TMiBnZRAloJPc4LSqOvly3+2+NuXNt6JgRM7KJEtDISe5RhovT1v7db91+xf1fqdAxI2ZkEyWgkR/uHmmUOS6DSi/1bL/1F+/eDx0zYkY2UQIaOcs9Oput/+I1vSfbP8+tf0PHjJiRTZSARl6frgT/AEdsYuGEoHMxAAAAAElFTkSuQmCC"
        },
        {
            "code": "1000543856",
            "serialNo": "1000543856",
            "itemCode": "ADV-000005",
            "itemName": "T-Shirt Small (Black)",
            "batchNumber": "7656",
            "color": "BLACK",
            "printDate": "2026-06-22T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADwklEQVR4nO3dS47jMAwE0Nxg7n/LvkEGCJIWRVKeYJbm0yKAY6ssFMiq6JvHI5c/z0/5eV++vl7f/d5/pruPLwp0zIgZ2UQJaOTN3WPBrQrbR3rZxXsSFHTMiBnZRAlo5Ej3WA6bnojAL3P+YMYGbHXjJXTMiBnZRAloJPf4teT1kbq6H+stl1/6KnTMiBnZRAlo5Cz3+FTtQEr3d41GQ8eMmJFNlIBGco/GLz+99lI2h07Dz1+PYUPHjJiRTZSARt7XPWr9//74d4GOGTEjmygBjby1e0Sf3ay7jDJv9eNapmP5gY4ZMSObKAGNHOseqWpaBdzNvi702Il+A7+qQceMmJFNlIBGznKPd1k2vbl2qlBettVdl7lzDB0zYkY2UQIaOck9ygkTV13drl8cN8umVkDHjJiRTZSARg5yj9LVTY8dTn6Ir9uasrcROmbEjGyiBDRylnsUrz5sfV1I6263dTXWbX4JQMeMmJFNlIBG3to90rOlwvbu9ZbQut3E8wAzdMyIGdlECWjkJPfokdL+13qaU5ngraPM0DEjZmQTJaCR89wj9oHrjp3o6d2ZFGkF1MWCKOiYETOyiRLQyAnu0X51eWOZc7LpsuQYOmbEjGyiBDRymnv0m3Xq4fudu/dD0rGvDB0zYkY2UQIaOcs9er9NHdx6I+7dSe2BjhkxI5soAY2c7B5b/YtB59o5XsaeJnNDk6FjRszIJkpAIye5R3xif+veJY5uXM25r1F3DEHHjJiRTZSARt7bPQpwKnVnT7xc5aKvDR0zYkY2UQIaOcg96gLiiFk3xpaX1RLwoGNGzMgmSkAjx7lH/GoD6Tb1dGuh0toq6JgRM7KJEtDIye4RXTud63RYAdVjNrO80DEjZmQTJaCR49yjlM6Xu7uH4yhCU6BjRszIJkpAIye5x7qZVjZ1Nt2tlErd331GGDpmxIxsogQ0cqR7rMva340Vui2yqSmxQMeMmJFNlIBGznKPgnk4BzFO5m6zvAWsNAo6ZsSMbKIENHKMe6zHUoV+MLmz7u2vdaKdQ8eMmJFNlIBGTnOPznQTejHnOiSd10IdC3TMiBnZRAlo5M3dI/2Ja+oSb3O78cmK3r4HOmbEjGyiBDRynHtEw66LnyJSNz97+UsAOmbEjGyiBDRyunt007VlGfLy9HW3uQEdM2JGNlECGsk9jh3c7lynzT/TYRWtr0LHjJiRTZSARt7aPcqIct0xm54rD5+Og4KOGTEjmygBjZzlHnVYOHr11fqoeHkcg4aOGTEjmygBjXyOUYK/Pef7eMlTMRwAAAAASUVORK5CYII="
        },
        {
            "code": "1000556687",
            "serialNo": "1000556687",
            "itemCode": "ADV-000003",
            "itemName": "T-Shirt XL (Blue)",
            "batchNumber": "00125",
            "color": "BLACK",
            "printDate": "2026-06-22T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADw0lEQVR4nO3dUW7jMAwE0N5g73/L3iALBG5FkZTb/ppPH0EcW2OBGM6Usqx+fOT275Xb++f1bV3y/lbO3jboIoMzsokS0MiHu8cGd3XYel3tc7/4M55d3dKgoIsMzsgmSkAj57nHctjU/zp8f1vmvAZQ+8ZD6CKDM7KJEtBI7rFb8te3rsI9Fsc/+Cp0kcEZ2UQJaOQs97ibWy7l71ddC11kcEY2UQIayT1av3zLY50HLp6+zRf/eg4busjgjGyiBDTyue6RWnp4+qePnxt0kcEZ2UQJaOSj3SP67Gbdlzl3k7zL0w8A33YOXWRwRjZRAho51T1S11gDb3b+3TWgl/XJFwB0kcEZ2UQJaOQs90gOnVw79k/3XrfYVkWlm0EXGZyRTZSARg5zj82SV//owVvr6uL0kVCgiwzOyCZKQCOnuMfNkqc1wdwN4OjucYzQRQZnZBMloJGz3KNfXnx4a7UvmLvbxhFDFxmckU2UgEaOcY911C+DSk9lV0m8tVOtDF1kcEY2UQIaOcs9bpYS13ddy5uw23z1MnboIoMzsokS0Mih7tFtGpHmm6O719L5OBENXWRwRjZRAho5zz26ynfBpco32nm16fQgGLrI4IxsogQ0cp57lIr28EC2M/F+SjrWytBFBmdkEyWgkbPco/fbbo3T1qu8tpNejIUuMjgjmygBjRzqHtskcZxlXtXwXcEc+26PhaGLDM7IJkpAI+e5R7yiXlZcOz3HrbsU73jQRQZnZBMloJGz3CO1V9sOC6fKoPpaG7rI4IxsogQ0cqB7lCVPqba9u1lqEQ+6yOCMbKIENHKae8SfNpBoxN3mEsnJ6y4W0EUGZ2QTJaCR89wjHZWJ47oC6jgbncYDXWRwRjZRAho5zD26svb4Kk86e/cwN6y5gi4yOCObKAGNHOIesfJNeyMeNiNeDl0K4TI5DV1kcEY2UQIaOdA9SkncLSXeitsIl4YSG3SRwRnZRAlo5Cz3KJh1+6Z0GC/p3tgpg4IuMjgjmygBjRzjHrH/6pD+desvNnzq62LoIoMzsokS0MhZ7tGZbvHgtIxqu3c8W1ZaQRcZnJFNlIBGTnOPux0ROxO/WkVv7wNdZHBGNlECGjnOPaJhV3NOZW2pcm//EoAuMjgjmygBjZzuHmWh8brZ8ent6rafgC4yOCObKAGN5B7dHhLJdVdJvPln2rui9VXoIoMzsokS0MhHu0eaZe7mlo8zynEozXZQ0EUGZ2QTJaCRs9yjTgtHr67b/a+2gLuzbYMuMjgjmygBjXw9WAn+A/SzO/uCgMCBAAAAAElFTkSuQmCC"
        },
        {
            "code": "1000633168",
            "serialNo": "1000633168",
            "itemCode": "ADV-000003",
            "itemName": "T-Shirt XL (Blue)",
            "batchNumber": "00125",
            "color": "BLACK",
            "printDate": "2026-06-22T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAAD00lEQVR4nO3dUXIjIQwE0LlB7n/L3GC2kvIYkMQ4+zt6fGRtDzReldQdgSDHEdvXeZ7n93H8/HP+vn39OH4++33wPXcOXT406CzDZ0QTJsCRD1ePX7irhQEvpDHjNe12ihkKOsvwGdGECXBkS/WouwWFvu8SpPv9CjrL8BnRhAlwJPXIyjlr+ibr/R9dhc4yfEY0YQIc2Ug9jjXpXVae04OQSUNnGT4jmjABjmyuHlWPakV5fvVeR16/WbHKDJ1l+IxowgQ4spF6hJZT4r//+NygswyfEU2YAEc+Wj1mnd2kuq9+SxlUevBVokBnGT4jmjABjmyoHmMd+Ua6A3DY283Fw9BZhs+IJkyAIzuqx905naDks1bfif0bDzrL8BnRhAlwZDf1uNqnxeilXCp9tnzHSbmhswyfEU2YAEf2Uo9KtaurHgZcTo4rdd//TgCdZfiMaMIEOPKp6lGtKIfjsKHa+FMZ8pI1Q2cZPiOaMAGObKYe21GVkocceJHp8dk6I3SW4TOiCRPgyDbqETZpt7VQIf39dI8wdJbhM6IJE+DIvuoxf5TrntI8+QuEfm8U6CzDZ0QTJsCRvdRjK85hVJUSp1aURkFnGT4jmjABjmynHmGVeZv01nu74QusOg+dZfiMaMIEOLKTerzejRay3KX4eHSeC5I3Og+dZfiMaMIEOLKfeqRt2JHWVhVUOQdOufLoMp/igc4yfEY0YQIc2UE95h6bq5rqbDgoeXUCqEiaobMMnxFNmABHPl890jHXMOrKa+vd2yUvXodBZxk+I5owAY7sqh6p7jjfQzw/v1PyCQQ6y/AZ0YQJcGQv9QgXTixCPDDnp/n24aq26n06FjrL8BnRhAlwZC/1CH1f46tLhkPmuy2Nmq+Jgs4yfEY0YQIc2Ug9rlHz+EWIQwVymDFs3EJnGT4jmjABjuysHuPdFjjNfafa5X8AOsvwGdGECXBkE/UIq8dh6rBwHBLmsGdbLE5DZxk+I5owAY7spR43ar6chK0qkMPbua2lydBZhs+IJkyAI5uoR1LtfJFEVThVrzIXf94OOsvwGdGECXBkJ/Wo9Hb0SLu3S31U9XQAlVNAZxk+I5owAY58uHrkpDflu2PABZxqoXaqDZ1l+IxowgQ4sp16zK+qRDjLdJg2yP70FDrL8BnRhAlwJPXI9zqlRLj6uzk5Yd7pKnSW4TOiCRPgyDbqUafEFfptjfEmX4XOMnxGNGECHPlw9RitWgce4jyp8TS2Ojv7nhY6y/AZ0YQJcGQv9ahkNuS7Q6u3x3v+uPsKnWX4jGjCBDjyfDAT/ANz3iBPWsWOqwAAAABJRU5ErkJggg=="
        },
        {
            "code": "1000866727",
            "serialNo": "1000866727",
            "itemCode": "ADV-000003",
            "itemName": "T-Shirt XL (Blue)",
            "batchNumber": "00125",
            "color": "BLACK",
            "printDate": "2026-06-22T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADyElEQVR4nO3dUW7jMAwE0N5g73/L3sCLLeKIIqmk+xs+fRRtIo3UATkDyrL99ZXbn+u6ru/HH/9+v34+e/z5XTrHH+8bdMyIGdlECWjkh7vHD9zd+gH3jKtLnGcbEaGgY0bMyCZKQCNHukff7fudTccudT3QMSNmZBMloJHc4+ScwYhPVe//+Cp0zIgZ2UQJaOQg97g3mFfJtaZIVWqppKFjRszIJkpAI4e7R9ej8+pyWbe69m/2sKFjRszIJkpAIz/XPVKrJfHvf7xv0DEjZmQTJaCRH+0eV9tSDZxOMKWqudbFTxTomBEzsokS0MiB7rGQOuvuZ7zr3X4Bjy+gY0bMyCZKQCNHukfqdsNF4G1vOS6qtucqoGNGzMgmSkAjp7rHi+3ielyq/LYWEK0bOmbEjGyiBDRymntsn/ePeli1clcmJ8OOJ5WhY0bMyCZKQCNnucfqlpDWZ/0CnuNbdy5nmaFjRszIJkpAI2e4RzdqA+5PRW3mnAx7nxE6ZsSMbKIENHKMexQP3krdHu56/xxh6JgRM7KJEtDIue6xQJL9JqTjPbGxX7Ru6JgRM7KJEtDIWe7RHYMqhp2mfXE7bH6NHXTMiBnZRAlo5Dz36O7dSW6chsYv0pb0/hxi6JgRM7KJEtDISe4RHTq59vF5TelA8ub90DEjZmQTJaCRk93j3WXYNMW2/VwMu64COmbEjGyiBDRylHvEHvXm1jT+iFTW+Lw2DB0zYkY2UQIaOck90tXWMmrz7+4IVaqL42TQMSNmZBMloJHz3GO7O/br9FmaLAHHb8spK+iYETOyiRLQyDHukSrfblT5tnp1WdSjC3TMiBnZRAlo5Cz3iFZ7rGjTI4iTp29TtNeAoWNGzMgmSkAjh7hHb9g3ZhyfHLq7cHt6/CJ0zIgZ2UQJaOQQ9+iNPB2DqkejIki9laf9B6BjRszIJkpAIz/fPaLVbq69ZkznjlPncgz5bs9u0DEjZmQTJaCRY9zjCNydJ+6m6MrkfUsaOmbEjGyiBDRyjHssl01+W1y7e0fd+z1s6JgRM7KJEtDISe5RWvdwp238o9VvT3vY0DEjZmQTJaCRg9xjG1V6dO/NSTPWW2TDsqFjRszIJkpAI8e5Rz9+myLuQa+ldG1/CAV0zIgZ2UQJaCT3SC+lqzZdHHoriYMTH3wVOmbEjGyiBDRyjHv0JXF98P+xGt5rNOiYETOyiRLQyFnuEbd2mzfePM35eBdt3Cred5OhY0bMyCZKQCNnuUdns6neXXXx5t9lPS/9GzpmxIxsogQ08vp0JfgLFLncDvr+xv0AAAAASUVORK5CYII="
        },
        {
            "code": "1000911086",
            "serialNo": "1000911086",
            "itemCode": "ADV-000005",
            "itemName": "T-Shirt Small (Black)",
            "batchNumber": "7656",
            "color": "BLACK",
            "printDate": "2026-06-22T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADx0lEQVR4nO3dYVLrMAwE4N6A+9+SG+TNY2gtS3KAv9XnH9AQZ5PZkXaR7biPR24f13Vdn4/H/1/X1+H3j+3sOixdbht0zIgZ2UQJaOSbu8fXBc/WX7Du+PnTLSIUdMyIGdlECWjkSPfouy24asLdHQsUdMyIGdlECWgk9+jNNXr6oer9i69Cx4yYkU2UgEYOco/HN1wqf9ff4olUSUPHjJiRTZSARg53j65HNOznYHD89BpH3p/sN2PY0DEjZmQTJaCR7+seqdWS+Pc/fm7QMSNmZBMloJFv7R5X2+rip24FUzzx0aJAx4yYkU2UgEYOdI+EdJ6LDf3uqubXCeiYETOyiRLQyGnukeZn0yTtc7i4Oyxevb1XAh0zYkY2UQIaOdE9ju/Ebi0C1+0oTlUzdMyIGdlECWjkNPfYitmbrR6OL/psrr3bPnTMiBnZRAlo5Cz3WD32OnYbfk4l8f0y5K1qho4ZMSObKAGNHOYe6apn60aeo3VvL9CWWjneETpmxIxsogQ0cox7JIdOl3Y1cG/xaS0ydMyIGdlECWjkXPeI1r1hRqR6n/Io5cmgY0bMyCZKQCNnucdxZVMZaj58s01szXfpQMeMmJFNlIBGjnOPMitbVyD37t59bdzu89AxI2ZkEyWgkZPc4/toc+N+CLnb3KluTAEdM2JGNlECGjnZPW6mYY/vv26tf4pXcQwdM2JGNlECGjnJPUpZe3f9uk9CKs/4mhuGjhkxI5soAY2c5B7HKjdelfqlDSfSZsT9GDZ0zIgZ2UQJaOQE91g90rqn9LdgxHlGd3P8+DzQMSNmZBMloJGT3WO1etVeIGevTqPRry7QMSNmZBMloJHT3CNN1x53+r8bao52X7aJgo4ZMSObKAGNHOge0Y0Pw8oR4TBxCx0zYkY2UQIaOdk9ClIF7j5FkO227S2gY0bMyCZKQCOHuMdy3uTaq94txXE36bstNH4NTkPHjJiRTZSARs5yj8610+ztcQVyOlxQ+b8A6JgRM7KJEtDIIe6xXDb67WHnxNIljTI3X28HHTNiRjZRAho5yT1KO2yQWB4lna0TvO0toGNGzMgmSkAj39w9VtFba9tlxKWGvntFNpfZ0DEjZmQTJaCRk9yjv367Rbx0O+xsP5yFjhkxI5soAY3kHmkjp7TuadtfuCuJV8F88lXomBEzsokS0Mgx7tGXxB36cavEWL1Cx4yYkU2UgEbOco80yhyXQXUv9dS3aGPnfTQZOmbEjGyiBDRylnt0Nls39C9vwnbPc+vf0DEjZmQTJaCR17srwT/1inS0lFYC1QAAAABJRU5ErkJggg=="
        },
        {
            "code": "1000933905",
            "serialNo": "1000933905",
            "itemCode": "ADV-000018",
            "itemName": "Reflat (Retail)",
            "batchNumber": "03462",
            "color": "White",
            "printDate": "2026-06-24T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADw0lEQVR4nO3dS47jMAwE0Nyg73/LuUEGGMQRRVLuzDZ8WgRB2yoLRLEq1Mf9eOT283w+n39e3+LH4/F4XdhuTrf80qCLDM7IJkpAI7/cPf7BXa3vcD0x3rmes/WIUNBFBmdkEyWgkSPd43hb58NrFK8nJovfQaGLDM7IJkpAI7nHT3HO6OmHqvd/fBW6yOCMbKIENHKQe1wlRqlNUzXcVdLQRQZnZBMloJHD3aO7I3r11RJm59oRCrrI4IxsogQ0cp57pFZL4s8/fm/QRQZnZBMloJFf7R7RZ7tSd80yb9ugli93dfEbBbrI4IxsogQ0cqB7LKSjdZcnXqPoB/B6LHSRwRnZRAlo5DT3uP6UdkD1s8x1bnm1eMtrFNBFBmdkEyWgkdPc43gmdmtd/7TUe+4FXWRwRjZRAho5xj061+5e9XAsk7e2BnD+TQBdZHBGNlECGvmt7nGcUd7L2jqAd//Wnfe3OUEXGZyRTZSARo5xj2Ovu11RyZxLrRyfCF1kcEY2UQIaOcY9OswEUuC2WeZuQxR0kcEZ2UQJaORk94h/WnXsOqyzzSh3S73xQkSBLjI4I5soAY2c5R7dNqhUHEfg1frjsNu/sYMuMjgjmygBjRzpHrEkTmu2d6djk5OnC9BFBmdkEyWgkfPco7jxcvJ0RGfZdNqQvHk/dJHBGdlECWjkZPfo9hjHvcNlB1V+r2JZwt1GAV1kcEY2UQIaOco94h3pcGvtf0Tqxrh7OHSRwRnZRAlo5Bj3iJZ893/myszz6ntTa0MXGZyRTZSARo5xj2LEVzueeu1XdNPVMiboIoMzsokS0MgJ7pF2Ficj7q8exllufp+9hS4yOCObKAGNHOMe3Tv6D2diS+V73Br1fk0UdJHBGdlECWjkQPeo883dtPJy6JuF21hYQxcZnJFNlIBGznKP1Y7A3beja5eFYOgigzOyiRLQyEHucXTt4sG1YC77jtO7K25+E0AXGZyRTZSARn6le9y4ed1PHMvfZmfxGyrhQRcZnJFNlIBGTnGP5bLRb+uccX9Lt8pbVm+hiwzOyCZKQCPHuMenL0hMIH2ZXDcfQxcZnJFNlIBGDnOP1SGVutvp2FJD3x2RzWU2dJHBGdlECWjkJPfo+2+PWF6dkDrbD1ehiwzOyCZKQCO5x3YSp/fl50cF88lXoYsMzsgmSkAjx7hHXxKnCebudf9NDQtdZHBGNlECGjnOPVbrXDs+J11IZ3ea6WfoIoMzsokS0MhZ7tHZbKqGO68+jud29RW6yOCMbKIENPL5xUrwF7RADvrKGFQEAAAAAElFTkSuQmCC"
        },
        {
            "code": "1000934596",
            "serialNo": "1000934596",
            "itemCode": "ADV-000003",
            "itemName": "T-Shirt XL (Blue)",
            "batchNumber": "00125",
            "color": "BLACK",
            "printDate": "2026-06-22T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAAD0UlEQVR4nO3dW47qQAxFUWZw5z/LnkGuhEjKZTvQ/YtXfSDI4xSy7LPlIgmPRx7/juM4fh6P18txHM9tz31rxzo4vnwe1EVGzqgmTsAjv5weT7lzpBNeSmvG85DbKaIUdZGRM6qJE/DIkfToD/vpIZwOWV+gSFEXGTmjmjgBj0SPvv1NffEb4P6Kq9RFRs6oJk7AIwfR4yl89N1w6lJLJ01dZOSMauIEPHI4PbojIrDPFeGk2VH7N2vY1EVGzqgmTsAjv5ceaaSW+E8vnwd1kZEzqokT8MivpsfRjgrnchnTRvcE7EuFusjIGdXECXjkQHqUSxYrktN6c1x5rl3zNS11kZEzqokT8MiR9KhXQMV328f0BRLn9+9DXWTkjGriBDxyID36+6u2zjd+izRF1ytf5KYuMnJGNXECHjmLHrWj7SbruFzWltfVU6+P1EVGzqgmTsAjZ9EjInlbUV7b0tXGqWFO1M5dM3WRkTOqiRPwyFn06M7ahMtPs/UG2q5Xvs6gLjJyRjVxAh45hh6Fwd2NOdu7HvF1lZm6yMgZ1cQJeORQekR0p1PTkyjqg//Ljohu6iIjZ1QTJ+CRs+jRw3mNNM+n22G3G32oi4ycUU2cgEeOpMebC6Jumt6F6fiuefo/dZGRM6qJE/DISfRYNE6YXlsSptO2RHzqIiNnVBMn4JGT6VG4vE3Wy9X/AUjED80xdZGRM6qJE/DISfTo29ptpIXjTunuO1IXGTmjmjgBj5xFj+7U1PmufrdH99YXx8moi4ycUU2cgEdOo8c6It2J0/9ce86TJit741nURUbOqCZOwCPH0CO1sAnE66ytPy6sjtTe77alLjJyRjVxAh45iR6v89/d61owvYH9doqsRF1k5Ixq4gQ8cgI9mkfxX8cmnEfhta3e6ENdZOSMauIEPHIoPdYUnXC5XCr9UlupXX4Ipi4yckY1cQIeOYge8dSN2oXBtWEu1x0XxFMXGTmjmjgBj5xFj3RsonHc8f5hxGuUJWnqIiNnVBMn4JFj6LEom3ibqF0O6W6MTY+oaK6loi4yckY1cQIe+dX0KKN73HDqgZ/j9lHF52inoC4yckY1cQIe+eX0qM88LP3uOe0SLi31HbWpi4ycUU2cgEeOo0cH7HVY1Nzmqcive6mLjJxRTZyAR6LHzU2wadE57U3rzVc3fEtt6iIjZ1QTJ+CRE+gRu+HtD1vXWXFb96jE2L1SFxk5o5o4AY+cRY+0ytyt/iZWx3PTwTv7qYuMnFFNnIBHzqJHh9n6QP+e3+/+3bVKUxcZOaOaOAGPPL7bCf4DFLcyIho6JKIAAAAASUVORK5CYII="
        },
        {
            "code": "1001016071",
            "serialNo": "1001016071",
            "itemCode": "ADV-000003",
            "itemName": "T-Shirt XL (Blue)",
            "batchNumber": "00125",
            "color": "BLACK",
            "printDate": "2026-06-22T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADw0lEQVR4nO3dUW7jMAwE0Nyg979lbqDFBptIIiln+2s+fQRJbY8MgpwBKUp9POL4GWOM5+fbGOP17XXt38/t5vXj+4DOMnxGNGECHHlz9XiDrEjvj3We51/018f4XMhTrFDQWYbPiCZMgCNbqsfFbROkuuU9Y5LuzzfoLMNnRBMmwJHUY6a/m1ZfpNS/VA/oLMNnRBMmwJGN1ONdUZ6YIREOheg0N3SW4TOiCRPgyL7qUd1RVZTTsm5W7aLKDJ1l+IxowgQ4spF6hBFS4l99fB/QWYbPiCZMgCNvrR6jHFmcQwdTuvBTokBnGT4jmjABjmyoHrOOXEl3PWPoQH4WLwCdZfiMaMIEOLK5eqRF2k3JV62udH57M+gsw2dEEybAkW3VI2h1NbZ2qWNKvD8DnWX4jGjCBDiym3rkjLY66iH9rS4rB9mHzjJ8RjRhAhzZSz2q9qawHTZ0G1dl5XTLfpoTdJbhM6IJE+DINuoRLr5HVXmu8uKq/LyDQmcZPiOaMAGObKMeMXstiskJbjuluGqIgs4yfEY0YQIc2Vk9pnQHzIB03BO73re+GXSW4TOiCRPgyF7qUbVBpdy22id7WL2NG4KgswyfEU2YAEe2U4+0Y6dCD8u1Ydq86AudZfiMaMIEOLKfekykdRwajac4h5L0KS+GzjJ8RjRhAhzZSz2qHuN1Lfawi2dV9/wfzhcU6CzDZ0QTJsCRndRjvWP79h9beaoF3n0NGDrL8BnRhAlwZC/1qB5NT+X7ovRfZcPQWYbPiCZMgCPbqMeq0OlQ/nLX6/xZtkFtXVbQWYbPiCZMgCO7qUc42jA8dTjGv0B6fDmDETrL8BnRhAlw5P3VY+2AOuXLMfPNpeZqimV+6CzDZ0QTJsCRTdRjPhWeX7Pcbe4wY1q4hc4yfEY0YQIc2Vc9whQVcPVtKnRQ96Df0FmGz4gmTIAjW6nHUbVDzbhKmI99x59CNHSW4TOiCRPgyF7qUal2eODYgRx+rtK9dkpBZxk+I5owAY5sox6jGEm1c+NUXWUOBxSnXiroLMNnRBMmwJE3V480thJyKivPEa7mBd5yCugsw2dEEybAkTdXj3zm4YoeduzkTqmUK++vDZ1l+IxowgQ4sp16VM+vRedNpkPWXMn+chU6y/AZ0YQJcCT1yAXmqitqVegtJZ5KfKmr0FmGz4gmTIAjO6hHnRLnw52O2fCeo0FnGT4jmjABjuylHqHKfLGpJzxf3byXn6GzDJ8RTZgAR/ZSj0pmr9ZXL97nUr+hswyfEU2YAEeOuzPBH+K5jcQgIcsOAAAAAElFTkSuQmCC"
        },
        {
            "code": "1001132443",
            "serialNo": "1001132443",
            "itemCode": "ADV-000018",
            "itemName": "Reflat (Retail)",
            "batchNumber": "03462",
            "color": "White",
            "printDate": "2026-06-24T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADyUlEQVR4nO3dUW7jMAxF0exg9r/L2YELBHZNkVTa/ppHH0Uztp8Ngny3VGTN65XHv+M4jv/nb/HH6/V6HziPvvpTfhjURUbOqCZOwCMfTo+33DX6c687xjM3t4hS1EVGzqgmTsAjR9KjPy0RerlZOSU91Pdv1EVGzqgmTsAj0aO2v5Hpm673L1ylLjJyRjVxAh45iB5v4aVD7rvhrpOmLjJyRjVxAh45nB7dGRHY12RwP+e7PFkzy0xdZOSMauIEPHIQPdJILfGffvw8qIuMnFFNnIBHPpoekbNdq1vRHZ9iIXmjQl1k5Ixq4gQ8ciA9bqWC7utjEvncNX8foC4yckY1cQIeOY0ey8H4Je29Fuq+4PpYvsxNV5zPQ11k5Ixq4gQ8cho97us/T0Yvy6Uiv1NLHNFNXWTkjGriBDxyGj2WJU8ftnqoD9BROx44/yagLjJyRjVxAh45hh5l4nh5YyeBuGudezqXtczURUbOqCZOwCNn0KNuLtGvikpd8wLn2BenDpm6yMgZ1cQJeOQgevSX7vZm2iO+7iNMXWTkjGriBDxyKD26S+/xi3di43kR3dRFRs6oJk7AI2fRYwvnBPHC5f512LI0irrIyBnVxAl45Dh6dO/kJDjHlVLdkuP6pS91kZEzqokT8Mh59Dg/pdFNIXebO1XOUxcZOaOaOAGPnEyPD1/DpnnkOhtdgJ32Szzf4qEuMnJGNXECHjmGHn1bW/viDt3pstIS75pm6iIjZ1QTJ+CRT6VH+ra1XLV0yLEHXtH/qRumLjJyRjVxAh45iB7L27H3SC/Lppsl4dJEN0rURUbOqCZOwCNn0eMem10nulNWpbp3BXWRkTOqiRPwyEH0OGm8fdd1s+S4Xxq13KJVoi4yckY1cQIeOYEeqcF9jyTXTTpv9nWiLjJyRjVxAh45lB4NalvhrgfeUrvoURcZOaOaOAGPnEGPm7yJ2mmCuWuYy7rjgnjqIiNnVBMn4JGz6JHOTTROrI736VcWd/sqUhcZOaOaOAGPHEOPoxmF2nVpVD/L3Pz3dtRFRs6oJk7AIyfR47cbJJZHSUeXXnl/C+oiI2dUEyfgkQ+nR93zsPS7121v4X4FckNt6iIjZ1QTJ+CR4+hRgL1wOWou6K7IL/ehLjJyRjVxAh6JHruXYCNwE6HTW7TfJO6oTV1k5Ixq4gQ8chI9ylRzXZAc/237Am3/Vyp1kZEzqokT8MiH0yNO7SbNa0R+p2vTVPHKfuoiI2dUEyfgkbPo0WE29bs3q+tOFNuuuUpTFxk5o5o4AY88nu0EX64PzndNw8BwAAAAAElFTkSuQmCC"
        },
        {
            "code": "1001149132",
            "serialNo": "1001149132",
            "itemCode": "ADV-000018",
            "itemName": "Reflat (Retail)",
            "batchNumber": "03462",
            "color": "White",
            "printDate": "2026-06-24T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADzElEQVR4nO3dYY7rIAwE4Nxg73/LvUGe1NcEsE2q/Vt//Ki2GxgiazwjE0KPI7af8zzP3+M47/b63+va+8Lv3Hn++NygiwzOyCZKQCO/3D1ecAEp9B0zjmk3U8xQ0EUGZ2QTJaCRLd3jodsAudq4i9nEw03df0EXGZyRTZSARnKPXP6Guriqev/iq9BFBmdkEyWgkY3c4yoxUm062lWlVqvR0EUGZ2QTJaCRnd2j6jEb9rUYHDAr156hoIsMzsgmSkAj+7lHaKEk/tPH5wZdZHBGNlECGvnV7jH77KbUffdbtkGlCz8lCnSRwRnZRAloZEP3GOvIW+tOMz5VzfcF6CKDM7KJEtDIlu6Rd0CFvVDz1/DixNJ5HQFdZHBGNlECGtnVPT4tRi/bpbYl8ToGusjgjGyiBDSym3uMKjeUtdWj2fw1tHED/10busjgjGyiBDSyk3ukheNQ+S7Lz9sjnVKXtJcZusjgjGyiBDSyh3uEi2NUPhuxqovr5ecZFLrI4IxsogQ0so17BIdOle/4a3n/NVl8dY4wdJHBGdlECWhkS/eYPTgMrU5pysvPod9t3dBFBmdkEyWgkb3cY2vT4RHuXCaPLqEtRTR0kcEZ2UQJaGRT9wgbooJ1h8nSs93qRZ/7RqGLDM7IJkpAIzu5x/tbaNUSct4fVTk+dJHBGdlECWhkZ/dISNVp/QEu/w5Auou7OIYuMjgjmygBjezkHqmsrXYRV9VwdWhiukfoIoMzsokS0Mhe7rGtciv/fnii+1ANQxcZnJFNlIBGtnGP2aHTofzl+6/VZGG71AQCXWRwRjZRAhrZyT0S0mLEYadU1SVghpuCLjI4I5soAY1s5h7PO5s2lW9Yag5OPpk4dJHBGdlECWhkJ/cYSKuRxzd23v1Ghbs9omI9fhG6yOCMbKIENLKTe4xvFXCaIjypDa69tFhrQxcZnJFNlIBGfr97jFHBtecF5nxWxTwsPMKd/Ru6yOCMbKIENLKXexyftxynUbt9yzdU3CkFXWRwRjZRAhrZxD3OoqUNUXlrVJrsYQ0busjgjGyiBDSyjXukFn4FZ3kdNjh5dXUAlVNAFxmckU2UgEZ+uXvkMw/DM9t5wAWcSuqda0MXGZyRTZSARrZzj2DY2xp4/3x2tf3pKnSRwRnZRAloJPcIBzllm04OvXuVduur0EUGZ2QTJaCRTdyjRsqHO22r4bVGgy4yOCObKAGN7OUeo1XrwMOc58Xg4/Hd2Xta6CKDM7KJEtDIXu5R2Wyod6+h6fWep193zdDQRQZnZBMloJHndyvBPwMh2fBhoxk2AAAAAElFTkSuQmCC"
        },
        {
            "code": "1001268200",
            "serialNo": "1001268200",
            "itemCode": "ADV-000005",
            "itemName": "T-Shirt Small (Black)",
            "batchNumber": "7656",
            "color": "BLACK",
            "printDate": "2026-06-22T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAAD0UlEQVR4nO3cW27rMAwE0Oyg+99ld+ALFHEkkZTa+2sefQRJY49cgjMT6vV6xfZ1Xdf1/X43v9zt/e3rcMm+QRcZOYNNlIBGPtw9fuDuFq4d/fy8m6/cdDFDQRcZOYNNlIBGtnSP+rJx/9LGU7x7DBa/gkIXGTmDTZSARnKPxVyHYR9K6v90D+giI2ewiRLQyEbucZcYqTa9C+G5TA6VNHSRkTPYRAloZHP3qK6YDfseEZ7ffcaR1ycrRpmhi4ycwSZKQCMbuUdouST++8vvDbrIyBlsogQ08tHucZUtlLqLdY/b3u9yXfy5DbrIyBlsogQ0sqF7jHHkZN3DevO644FePwB0kZEz2EQJaGQ/91iGkNMkbQDJH4PZr08LXWTkDDZRAhrZzT2u34eL71I3FcJVSTxbN3SRkTPYRAloZDf3qFx7e5pTtdFnY9373wTQRUbOYBMloJFPdY/ZksOe2FHWViPKn/tLd05rmaGLjJzBJkpAI3u4R96dMwOHUyeGdS/TuocKGbrIyBlsogQ0spF7BIc+1MC57/AAoUEXGTmDTZSARjZ1j3TrjXnoNi9ITh93Pwegi4ycwSZKQCOf6h7zn/JRTXNdfFe+oe+5FUujoIuMnMEmSkAj27lHGkzObhzq3dBtNekLXWTkDDZRAhrZzz2GQ88tlLrbw502A9HQRUbOYBMloJFN3aNeYxzMeamVQyGcpnDX0hm6yMgZbKIENLKTe9Rl7dJCNVwh7Z4RusjIGWyiBDSyoXukba7LntjZq5fjKOZ7D7U2dJGRM9hECWhkG/dIxewohDe7XoNDp7nd9ZhF6CIjZ7CJEtDIXu6xIAUjDsulzrO36eL5TAvoIiNnsIkS0MgO7pHceLvX9TTUvPsBAF1k5Aw2UQIa2dA9kmEv14bFx/O3YeK2OH4RusjIGWyiBDSyk3vMXWyAU995e0+6rfgHoIuMnMEmSkAjn+8eW9cOY8bBusfFaQp39m/oIiNnsIkS0Mhe7nFw87yeeO6nWFn8gYorpaCLjJzBJkpAI5u4R3LtZaS4XhWV99P+eQwbusjIGWyiBDTy0e6RWjg+ohpHvopv8wRv2QV0kZEz2EQJaOTD3SOfeTi79mlP7HZsOZbZ0EVGzmATJaCRndwj3Z+PIK7q4mz5qR/oIiNnsIkS0EjusRp2NZlbfRuM+VMN12U2dJGRM9hECWhkE/eoVhbX6Mc1xpt6FbrIyBlsogQ08uHuMQ/tng8jDtO9i8WXw8/QRUbOYBMloJG93KOy2QVp9up8EkW1hKr0b+giI2ewiRLQyOvpSvAPqQ+rEIhNJxAAAAAASUVORK5CYII="
        },
        {
            "code": "1001317867",
            "serialNo": "1001317867",
            "itemCode": "ADV-000003",
            "itemName": "T-Shirt XL (Blue)",
            "batchNumber": "00125",
            "color": "BLACK",
            "printDate": "2026-06-22T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADwUlEQVR4nO3dUY7iQAyE4bnB3v+Wc4OsxALptivAvuKvH9BAkgqy7L/GSXf4+anjz3Ecx+/Pz/3lOI7bZ22/x87ry/tBXWTkjGpCAoz8cve4yT1G2fd2inTG+4Z+ilWKusjIGdWEBBg50j3ybr/vbPo8Y7Pu51/URUbOqCYkwEju0Z1zMeI3ffFHvkpdZOSMakICjBzkHrdGeOuQSyO8tsmlk6YuMnJGNSEBRg53j7THKvIY59tm4v9zDZu6yMgZ1YQEGPm97lFGb4k/f3k/qIuMnFFNSICRX+0eRxzbXKj7fts0qNOXU1/8VKEuMnJGNSEBRg50j6KU7sW2M/auObTO1EVGzqgmJMDIae7xap3O+tc2NWr9Uo+x2vldj7rIyBnVhAQYOc09Hse/vhh9KVxa4nAUdZGRM6oJCTBykHsk1748WWqTy1jNnrrIyBnVhAQYOcs90vSmtfPt5pwuK5e/ziOoi4ycUU1IgJHD3KOvzlmF063ZsoA2XX5eRamLjJxRTUiAkWPco3avcWFO8fTtKcVpQhR1kZEzqgkJMHKye+Q+tivll+2O7m7d1EVGzqgmJMDIWe5xOQ2qGHZqiT9YVEtdZOSMakICjJznHm2dzkXT++Lebt9AXWTkjGpCAoyc5x73d92mz0/eTUjevJ+6yMgZ1YQEGDnZPVK/u8q1GVTxdwDSYf/eUhcZOaOakAAjJ7lHbmu3kbvh8gXSCqCrppm6yMgZ1YQEGPmt7lHutibDXr06WXd5GHG+hk1dZOSMakICjJzlHmUlTlneU05WhNet+ywr6iIjZ1QTEmDkVPd4NW24bQ1K4UtRFxk5o5qQACNHuUfy2/tn/akTydjLfvs/ANRFRs6oJiTAyGnuESZK7ftmh75c6BMev0hdZOSMakICjBziHs2Di3CZJFXu1BbXvtSjLjJyRjUhAUbOcI/TeYtrp0U9pWHOa3ce47kbdZGRM6oJCTByjHs0m77skEv7m65Gn4a9fVHqIiNnVBMSYOQU92hm++qXXNdd0lXm8PN21EVGzqgmJMDISe7x0WP8t5/HeVpy3LpadzgFdZGRM6oJCTDyy92jP/Ow9bvnAQ/hNhfqyrWpi4ycUU1IgJHj3KMZ9ubLq+bWP3fLb+ehLjJyRjUhAUZyj22Fa7yZ2xz6omGOvkpdZOSMakICjJzkHu08fULy+lnvhvcejbrIyBnVhAQYOcs91ku7rx9GXG73licshsvP1EVGzqgmJMDIWe6RbLb0u69WwqYpVNG/qYuMnFFNSICRx7eT4C94R2MgA4Hn/gAAAABJRU5ErkJggg=="
        },
        {
            "code": "1001382630",
            "serialNo": "1001382630",
            "itemCode": "IN-003475",
            "itemName": "R-7010 (Blue)",
            "batchNumber": "10001",
            "color": "BLACK",
            "printDate": "2026-06-22T00:00:00",
            "warrantyPeriod": 13,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAAD10lEQVR4nO3dW3IrMQgEUO/g7n+X2cHcSsq2ECA7+TVHH3l4pJ4pCroLBsm3Wx7/ruu6vm6371/Xz7/3H7fvz77K5DTlzYDOMnxGNGECHPnh6vED9xhpwR1u3XH7t7tFhILOMnxGNGECHDlSPfppC64qcXfHAgWdZfiMaMIEOJJ6lPQ3JsfH8Uddhc4yfEY0YQIcOUg9foC3DHndouTFKZOGzjJ8RjRhAhw5XD26GQlufZbX70/WVJmhswyfEU2YAEcOUo80Ukr8px/vB3SW4TOiCRPgyI9Wj6sdKdVNHUxdB/Im2M9l0FmGz4gmTIAjB6rHqiP367s7Xs0L3q15GDrL8BnRhAlw5ET12ErI5SXtVi6OmJ3Oryn3p4XOMnxGNGECHDlNPdb6Y7m4ini80B1HUR4HOsvwGdGECXDkDPWo50qUbczb+RNdQ3LS7+df0FmGz4gmTIAjZ6lH194UE+FHWXmJ8Os25JxEQ2cZPiOaMAGOnKUe6eJalZS8y4E3mU658hMUOsvwGdGECXDkGPWIGlxPH45w2/7XIvG1ygydZfiMaMIEOHKoeiyQJM79HesDxHlRuqGzDJ8RTZgAR85SjyLO3aFNtdS8Pouj+S4d6CzDZ0QTJsCR49SjvJV9zF1qnJLeeKEeUBweGTrL8BnRhAlw5CT1WGrc5cCp+biT7qL40FmGz4gmTIAj56rHu9ewhwx5jeNT7Lt4oLMMnxFNmABHTlCPPq3dRiwcH5W82wF0SpqhswyfEU2YAEd+tHqUba6pP2ppdSfdW14cbwadZfiMaMIEOHKaehwT4V+cQ9y2QYXKM3SW4TOiCRPgyGnqcWyISrocr1at7nurnntvobMMnxFNmABHDlGPd51NtUkqyXEP8HKPEHSW4TOiCRPgyE9Vj16wNyHuis5rfnkK6CzDZ0QTJsCRc9UjLngNvH0WV2xF6/IiGDrL8BnRhAlw5CD1iIK9qXZXfk4Jc9d3HCefatPQWYbPiCZMgCM/VT2KTB/OQSw7dprO4iDd24NCZxk+I5owAY6coh5FbOtBEl1XVL8xtqlhQ2cZPiOaMAGOnKQeZWwl5FhHTvluvXqsN0NnGT4jmjABjpyjHjXpjeiv9sQeG6dymg2dZfiMaMIEOHKSesS/0hkS9U1tfJRu7K3J0FmGz4gmTIAjqUc6yKnT5e57c1LW3Jw6sZ1PDJ1l+IxowgQ4coJ69ClxPa/pmA3vORp0luEzogkT4MhZ6vG6IarcJ63dj0VM1WToLMNnRBMmwJGz1KOT2QS88uL6RXVlxUm/obMMnxFNmABHXp/OBP8BqgbOOHFTDokAAAAASUVORK5CYII="
        }
    ],
    "page": 1,
    "pageSize": 20,
    "totalCount": 166768,
    "totalPages": 8339
}
  }
  catch (error  ) {
    console.log('tokensssss',  token)
     return {
    "items": [
        {
            "code": "1000041184",
            "serialNo": "1000041184",
            "itemCode": "ADV-000018",
            "itemName": "Reflat (Retail)",
            "batchNumber": "03462",
            "color": "White",
            "printDate": "2026-06-24T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADxElEQVR4nO3dUW7jMAwE0Nyg979lb+AFiriSRlSyu5/h00fh2NLIGJAzoC2rj0e2r+u6ru/56Jraz4XH89w4Gj/fNOiYETOyiRLQyA93jx+Q0eP++QL963l1nuc+l5NBx4yYkU2UgEa2c4/hsDPmAhyThTHHjNMRdMyIGdlECWgk9xhF76iLo93W+3++Ch0zYkY2UQIa2cY94tyYrJq7qpChY0bMyCZKQCM7u0f1uDe6zUX8fhfxhPrNM2zomBEzsokS0MjPdY9oMfSf/rxv0DEjZmQTJaCRH+0exfPjXJQU75tnT49+0b6hY0bMyCZKQCM7usdw2Ap49t/DA+Z41AwdM2JGNlECGtnUPaKOnT+xqZY8LePD07dhywF0zIgZ2UQJaGQL9zgUuFsNPFe5+w0sI+ar0DEjZmQTJaCRjdxjtt8YfyyO9zI5a+C7C3TMiBnZRAloZC/3CEvekIaJj4XGo8sC935pFHTMiBnZRAloZBv3iKPnz1c2HYXwmLZwbeiYETOyiRLQyEbuUa1xipe54dqHQrjoBx0zYkY2UQIa2cs9jiVxePBWMFd7TUSZDB0zYkY2UQIa2cg9ttXB1dTVGuP4WHZ/ygwdM2JGNlECGtnUPepHyI/3WyUeNmz6nRs6ZsSMbKIENLKbe9wOPY9afDmA6293YteJdaExdMyIGdlECWhkG/eI/4u+jN/sfL+fGDYf/VbD0DEjZmQTJaCRvdwjSuLFxCuk2thjBHTMiBnZRAloZDf3eGHJw7r3z3bqN7r1mmXomBEzsokS0MhG7vHKfis3rrpUK6WgY0bMyCZKQCP7ucew6a1HtUtinFvuZ4OCjhkxI5soAY3s5h7zxXpl03m1cbR52LqnBXTMiBnZRAloZBP3eLF2+PjZzrLDU+Xzv0fQMSNmZBMloJEt3SOOrhevZqv7CRNP14aOGTEjmygBjWziHmtZPE1Rndumjfe4sTT5+W4YOmbEjGyiBDSyjXuMbs8Wy4ujyt0tfmvrN0LQMSNmZBMloJHt3CNaae55brlwWjMFHTNiRjZRAhrZyz0q0w3/3rx6gRv3Ez5fGjt0zIgZ2UQJaOSHu8ferTbnw5c9cSvZDzpmxIxsogQ0sp17zH0X9IEzD13WR20zbntaQMeMmJFNlIBGtnaPep5DvTub/V+5NnTMiBnZRAloZDf32Ddo2lx7uTBb97oPMXTMiBnZRAloZDv3mHscNnKqSuL5KD6lveeGjhkxI5soAY1s5h7RYqfDauuJ3b+3ezw16JgRM7KJEtDI64OV4A8QaHvxahe9qgAAAABJRU5ErkJggg=="
        },
        {
            "code": "1000183745",
            "serialNo": "1000183745",
            "itemCode": "TS-000122",
            "itemName": "Choran Chatni (2.5)",
            "batchNumber": "0344",
            "color": "White",
            "printDate": "2026-06-23T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADwklEQVR4nO3dUW7jMAwE0Nyg979lb5AFiriUSNpJ99N8+mgTOx4JA3IGkmn58cjt6/n8+f98fr+OPPcWx9LZxwcNOmbEjGyiBDTy5u7xtV96oK+forOfH0e3x6fXjxMUdMyIGdlECWjkSPdIv+iAo+/X1zgWJt6MDDpmxIxsogQ0crp7FF8ONz4wo4t+UNAxI2ZkEyWgkdxj99WDjzTVLXPl//NV6JgRM7KJEtDIu7pHWWWOSe++ZpyvqLOyT9awoWNGzMgmSkAj7+seqSUP/tOf9w06ZsSMbKIENPLW7rH67LV1xw3VYxTltm5q39AxI2ZkEyWgkRPdozPs1E9nzuu1/THomBEzsokS0MhZ7rECR2XxVuybzDn1fVEjDB0zYkY2UQIaOc09ug7TvLh7puZ6sL/WDR0zYkY2UQIaOcs9wqtPF4772XB9KqmMDDpmxIxsogQ0cqR7rEjxNe7UdvtKBFIqOW4adMyIGdlECWjkEPcohU5humnlOZASerRUOAUdM2JGNlECGjnPPTq4zY3jbJo1r62vT4aOGTEjmygBjZzlHsm/135Oi483i+/MHjpmxIxsogQ0crJ7nAKnCW5c9UEx1fthQ8eMmJFNlIBG3s89Tl43cPGy1237xNLFPmGGjhkxI5soAY2c5B4JuNhvMvaTbsszPr8TYeiYETOyiRLQyEnuUa6/3iUxDaV6egwPOmbEjGyiBDRyonukB3i2k9c9hn83Nr2ehI4ZMSObKAGNHOIe/UQ47ZKYbusemF0tcl5lho4ZMSObKAGNHOce6wXVdcux09XoVHfcL0tDx4yYkU2UgEbe1z3SoXIbdmtpFKudb31Dx4yYkU2UgEYOdY8L4Po1LTp3fe/Fx9AxI2ZkEyWgkbPcY20Vs0yE09m66FzWm6FjRszIJkpAI0e5Rypquq57ql69unazSyJ0zIgZ2UQJaOQ491gXjt/erl1roepSM3TMiBnZRAloJPdoJ7jd9LeuS6/uXp04A0PHjJiRTZSARt7aPfppbf1tmu92q8xlSry+iwc6ZsSMbKIENHKCe5SWVooPc+5MPHVbjB06ZsSMbKIENHKee5y8RC46KyVPV++ea6uioGNGzMgmSkAjJ7lHQereKXdSY1ysfy9Sho4ZMSObKAGN5B7pcZyTKuDrs+e+Ch0zYkY2UQIaOc49ylS3bC28tHVPir1SCjpmxIxsogQ0cpx7FKTDkk+fjl2tO65tljyhY0bMyCZKQCNnuUdq3QaJdUuJ1au7m7lnDTpmxIxsogQ08nljJfgHuyeyy4dNEZsAAAAASUVORK5CYII="
        },
        {
            "code": "1000185889",
            "serialNo": "1000185889",
            "itemCode": "ADV-000018",
            "itemName": "Reflat (Retail)",
            "batchNumber": "03462",
            "color": "White",
            "printDate": "2026-06-24T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADw0lEQVR4nO3dUW7jMAwE0N5g73/L3iALLJyKIimn+2s+fRhOZY8MYjhTSorz9ZXbn9fr3+Fq36UjHtJtnxt0kcEZ2UQJaOTD3WMhveJd18fuuu/Su+6NUNBFBmdkEyWgkSPdoxj2+/6C9L4/nRUn/zmDLjI4I5soAY2c7h7Jq9eIy6F7YOgigzOyiRLQSO7R+Go31bzs/Lsx3P/xVegigzOyiRLQyEe7R/fvVVm43UrVY0nczDJDFxmckU2UgEYOco/Uuqnd3x4+N+gigzOyiRLQyEe7x+vctgXVVOp2y60NAHSRwRnZRAlo5Ej3WJufaiFc5pZXR9pjvEa8zqCLDM7IJkpAIwe6R7dc25/VldrVcUGtSvhybegigzOyiRLQyFnu0d9Vrg1nyed7O48PBl1kcEY2UQIaOcY9ugK3jFPr4uN3Wn8eGbrI4IxsogQ0cpZ7REveCtxi2HU/cYLr5puhiwzOyCZKQCPnuUesct+d6VAuTsAHFOgigzOyiRLQyFHuEYdJC7KpBq4vI15nsUJ+XwddZHBGNlECGjnUPSJmVxdXc07jdPuTg7lDFxmckU2UgEYOcY/jmyOWa6eO5ORpu1QEhS4yOCObKAGNnOYeyZc7E0/bi4/FcfwbdJHBGdlECWjkUPe4+yW5hBQfoSDVuhi6yOCMbKIENHKee6T54fqNnfQA6bs7J+Br9Ra6yOCMbKIENHKSexRzrlPIaVm3FMKdde+/xQNdZHBGNlECGjnEPWJtW706Vb43u5J764YuMjgjmygBjZzmHl29m5Zw04xy93aKvkyGLjI4I5soAY2c5R6xM9l0LXBjq0jR+7dLoIsMzsgmSkAjp7hHKnDPy7D5bD3FZud7B3SRwRnZRAlo5DT3uHtlf9katT1ANOz+x3OgiwzOyCZKQCNnuUe/K+q476lOJvfblW93G0MXGZyRTZSARj7VPW6Au5nn6sQR7j3Yz4jQRQZnZBMloJGz3KP4cl2QXWOnS+KIG0rbAV1kcEY2UQIa+Xz3KM68bYiKdp7cuJuX3i6GLjI4I5soAY2c5x696aZSd9ue3BXC0dPrbDR0kcEZ2UQJaOQc90hbhA/f50mYvVefdkVBFxmckU2UgEZOco/kvKnK7eviuy1U4W/QRQZnZBMloJHT3SOWyt1OqY8vIw6XQBcZnJFNlIBGTneP8sXYw6FMPzdODl1kcEY2UQIaOc49Vrv52K3ZVoA47KfVW+gigzOyiRLQyOe5R2oV/Spw1617vRt699dZdA26yOCMbKIENPL1YCX4C+RD5WkD8guDAAAAAElFTkSuQmCC"
        },
        {
            "code": "1000279426",
            "serialNo": "1000279426",
            "itemCode": "ADV-000018",
            "itemName": "Reflat (Retail)",
            "batchNumber": "03462",
            "color": "White",
            "printDate": "2026-06-24T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADxUlEQVR4nO3dUY4iMQwEUG4w978lN+iV2IE4tgOaX/zygXZIU2mV7Kp1Oknfbrn9XNd13W+369Ue3z36fr+4x4vjx+cGHTNiRjZRAhr55e7xgNuQIubqfWBuSOUGEhR0zIgZ2UQJaORI9+g8OA62gB+YT9fu/XsHhY4ZMSObKAGN5B6bVy9fDW784miVzn/2VeiYETOyiRLQyAnuESvSrbaNdfEaYquGoWNGzMgmSkAjx7tHmWWuNp0Mu9T013mWGTpmxIxsogQ0cpB7pJYWOv3p43ODjhkxI5soAY38ave42rZce1ujVNx9mfNPiwIdM2JGNlECGjnSPdKK3/TItD487R6yNncGHTNiRjZRAho5yz1i57YCKhbHaR65WwvVbardh4aOGTEjmygBjfx+9yhwyZe77azLnFPbxoaOGTEjmygBjZznHmuI/iMtb3rv/6dHuNAxI2ZkEyWgkWPco5tCrlXu8VbWd7F3P80JOmbEjGyiBDRyiHss541Vbn1wm1rBXB3RuqFjRszIJkpAI6e5R7eK+P72p8dnu9us9f81V9AxI2ZkEyWgkZPc42jdabD+us3ny5/QMSNmZBMloJEj3SN68DLisrxpW5Xc3UWphqFjRszIJkpAI6e5x9GXu/nmVPmmi5sNQdAxI2ZkEyWgkZPc47gdJ12bpp/j2PUXrz+hY0bMyCZKQCNnuUeaH16WXBz68D66cgPPBh0zYkY2UQIaOdE96ntVr1Nb43Rlcpqhho4ZMSObKAGNHOoe0ZcPrz9fHd11vXU3RzpBx4yYkU2UgEZ+uXsczpUoHd1BiofT/8PPoGNGzMgmSkAjJ7lHKYTTsUx1yXFBf3MxdMyIGdlECWjkNPeovtyXus9WJpPTCYvNOwOgY0bMyCZKQCOHuEesXuvJEQlp9UbD7l5F1+wRgo4ZMSObKAGNnOAetXJ9s+7p43PcYtbQMSNmZBMloJGj3KMe3xSt+3ntAi418LbbJz/ChY4ZMSObKAGNHOceqTOtioq92yXdOOk/ANAxI2ZkEyWgkaPc42ra6sh3cp6I7u8ROmbEjGyiBDRylnuUVp/Z9v57/zwbDR0zYkY2UQIaOc890tGGyX67RcWdLx829UDHjJiRTZSARs5zj86wy3zz8urnv5Kxt8NCx4yYkU2UgEZyj2SJadL54+vUw2/f+Sp0zIgZ2UQJaOQE9yi16dV/FyvfUw0LHTNiRjZRAho5zj2S3x6nlQvchhnxoGNGzMgmSkAjh7pHat3enbptp7uf1AsdM2JGNlECGnlNU4J/kMuxKz5HVKwAAAAASUVORK5CYII="
        },
        {
            "code": "1000353643",
            "serialNo": "1000353643",
            "itemCode": "ADV-000003",
            "itemName": "T-Shirt XL (Blue)",
            "batchNumber": "00125",
            "color": "BLACK",
            "printDate": "2026-06-22T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADyUlEQVR4nO3dS3LjMAyE4dwg97/l3CBTSSVDsgEpXsxK+Lhw/JBbKhTQf/gw9faW7f3j4+vvx2dbz/aXf24+/aVRFxk5o5o4AY98OD3e1+efR/yoR/vSvHz2/bWQoi4yckY1cQIeOZIeccT+EJj++v6fHt1FirrIyBnVxAl4JHp8k3MxdKfxD00XXDsS33KVusjIGdXECXgkeiy4Jjn/h0dSFxk5o5o4AY98ED3KKPMa7r2Yml2d1lB/ZQybusjIGdXECXjkc+kRrZtkffXh90ZdZOSMauIEPPLR9Ng5e4HuWK3UTbcGsP99Sl1k5Ixq4gQ8ciA9OmDHeQLOsR44ON2+oi4yckY1cQIe+Xx6xKzs/iOaAPblGHR3njJ7S11k5Ixq4gQ8cgI9ygxsbCSxusQH2ON6OgHqIiNnVBMn4JHz6BFHdAPHIbxedtTer4y6yMgZ1cQJeORQesRbldXrjJ36i0ujqIuMnFFNnIBHPpwe+56HRysztWvkuV7Uzu/9EOoiI2dUEyfgkdPo0ckFv+vUbJznalqXusjIGdXECXjkLHqUb12sMY4LiPfiGqmLjJxRTZyAR06mR7fuaWdwdJjrguT903LPHeoiI2dUEyfgkYPoUfeLKL3ci4VTO5wvjqMuMnJGNXECHjmKHjuI66qoHdgxNVvndgP2iXnqIiNnVBMn4JHPp8dq3WHlAuKW5sHqJVW2eaIuMnJGNXECHjmDHnXd0/rqpVKH+LZRFxk5o5o4AY+cRY+DskHoONn9cqnA/tnhpi4yckY1cQIeOYYeC78FuJXGMS4d597fK/8dUBcZOaOaOAGPfDw9YlVUTMMerTtP102mLjJyRjVxAh45lB5L82Zl09HVXZrduc/Fx9RFRs6oJk7AI2fRY1c6nu2d4+4nOnUTiu5SqIuMnFFNnIBHTqRH9wOebt1TZfVO7WaXROoiI2dUEyfgkePoUbh8tHXsLnKsoyoq1EVGzqgmTsAjx9Oj3kmu32ZitaD7QeLtW/FAXWTkjGriBDzyqfTou7Vdf/Xo73YD0aVLvN+Lh7rIyBnVxAl45AR6lNbdBefyjnPHadtxYOoiI2dUEyfgkbPo0d1E7mK/xP7cMefar4qiLjJyRjVxAh45hh5B47Ke+HLDim6DxHPvCuoiI2dUEyfgkehx/ES2o/FLa4RvuEpdZOSMauIEPHIWPaK/er+18H7ac6UUdZGRM6qJE/DIcfTohou73ZxibPdmMdW5mxN1kZEzqokT8Mgx9IjWbZDYTdfG/ei62VfqIiNnVBMn4JHvs5zgLyVaErj+2WjFAAAAAElFTkSuQmCC"
        },
        {
            "code": "1000471360",
            "serialNo": "1000471360",
            "itemCode": "ADV-000018",
            "itemName": "Reflat (Retail)",
            "batchNumber": "03462",
            "color": "White",
            "printDate": "2026-06-24T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADwklEQVR4nO3dWW7jMBAE0Nxg7n/L3EADGBORvYie/LofPwzbMotCobvKXPX1lcuf67qu7/vddV2vd69r/7743n+8v7wv0DEjZmQTJaCRH+4ePyALacdcV0OLr4+pWoGCjhkxI5soAY0c6R6dB+8g371D9/4dQaFjRszIJkpAI7nH6hLXbnL/cv3WV6FjRszIJkpAI4e4x2GUeSH9lNQbho4ZMSObKAGNHO8eZZQ5DPwWN63jwGmE+s0YNnTMiBnZRAlo5Oe6RyppGvVXL+8LdMyIGdlECWjkR7vH1Za0UCkMAaeybqpBgY4ZMSObKAGNHOkeC271bav1lsZCbzhBQceMmJFNlIBGznOPfuA4LDtI22n6bTdPu3igY0bMyCZKQCMnuUfZ5rq8Ok3h/sf8bJnWhY4ZMSObKAGNnOUe6eJhd05qorup4wQxdMyIGdlECWjkBPfoerQBeNVPze6jzOHd1iJ0zIgZ2UQJaOQk9+j7wKnZum44efN+Ybdu6JgRM7KJEtDIae5R52K7JU+pN7zfQLjHvOYKOmbEjGyiBDRyknskry7m/HDm/17qcf/QMSNmZBMloJGT3SOZc+rqltnb8Dy61OzTBDF0zIgZ2UQJaOQE99it9vG4w9BNTvfTAdzdaeiYETOyiRLQyIHu0fv3+pgeb/Owi7bxfuiYETOyiRLQyGnuEdYOJw9eSIcVyKvG8dQJ6JgRM7KJEtDICe6xysMzcvYKnTl31n1PC0PHjJiRTZSARo5zj7M5p+206ScH695HmaFjRszIJkpAIye4R3TZfCLT42bZw6aeZqExdMyIGdlECWjkEPfodsLu351O9U9OXu4HOmbEjGyiBDRymnvspV/ZFDrHdVq32/fTNgEdM2JGNlECGjnJPe7B4efnzPWDznWjT/orAB0zYkY2UQIaOco9ugqHWsHE0+/WHwDomBEzsokS0MiJ7lG/Kp3ZdDZi7QPvLcauM3TMiBnZRAlo5Dj3WIad3Lhs5QkzuodR5vvH0DEjZmQTJaCRk9wj+vFmuvvsbdo2m6y7nk183wB0zIgZ2UQJaOQs9yglYPbAy867Wd5l3dAxI2ZkEyWgkfPco3vOXNrZc97Psz7WAyygY0bMyCZKQCPnucdu2GnvTkBKw8+99cdmoWNGzMgmSkAjuUc1yN1mH64m7z/6KnTMiBnZRAlo5Bj3KJ3jVDVUe/MvBDpmxIxsogQ0cpx7FLiHYeWyFjlgdnYOHTNiRjZRAho5zD1SSadJPJ5IXO8nXYWOGTEjmygBjbymKcFfsDdTLDb7ypYAAAAASUVORK5CYII="
        },
        {
            "code": "1000502995",
            "serialNo": "1000502995",
            "itemCode": "IN-002788",
            "itemName": "R-520 (White)",
            "batchNumber": "10002",
            "color": "White",
            "printDate": "2026-06-23T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADvUlEQVR4nO3dUW7jMAwE0Nyg979lb+AFgiaiSMrd/oZPH0Ec2yNjQM6Ukqw+Hrl9Xdd1fT8e17s9f3uee55IF8eP3xt0zIgZ2UQJaOSHu8cTLiGlG1aPq9vVz3ZHhIKOGTEjmygBjRzpHv1lL7jOhMsl9XmgY0bMyCZKQCO5x8lcgxGfqt6/+Cp0zIgZ2UQJaOQg93jsRW8deY4n6mg0dMyIGdlECWjkZPforoiG/RoMjt+Sif9lDBs6ZsSMbKIENPJz3SO1WhL//8fvDTpmxIxsogQ08qPdI/psV+pW6163/XyrdfEbBTpmxIxsogQ0cqB7LKRi3a/DHmTruzwAdMyIGdlECWjkPPfYXswph9twcfLqzuf3FVXQMSNmZBMloJHT3KM7mVpdLtWXxGVjCuiYETOyiRLQyGnuUSvam866BcmpRduHjhkxI5soAY2c5R7d8qZYCK8Nlg4m3Ln2ugM6ZsSMbKIENHKYe9S3c/pVUeuG+gLtbYUMHTNiRjZRAho5xj1y9doMJpf1Udsuxd2CKOiYETOyiRLQyMnusaw71cAF6bDxfzwRnww6ZsSMbKIENHKWeyRLLs6bOtvmdkvbimjomBEzsokS0Mih7lEGkw9F77HbbtIXOmbEjGyiBDRynnv8HK2WgNN+Td2C5M3xoWNGzMgmSkAjJ7tHNw2bFkmVLrZWpnC30hk6ZsSMbKIENHKUe8Qr6sRtuv+IVJ7xPTcMHTNiRjZRAho5zj3S0qh4VyqTt+0o4r03tTZ0zIgZ2UQJaORA9yjzs2mHifRST93pP403Q8eMmJFNlIBGznOPiHS3bLicrUjpUd7XQceMmJFNlIBGjnGPVOAupHTYV77HpVH7NlHQMSNmZBMloJFj3GPb3zBZcr+yeJ3t9qSAjhkxI5soAY2c6x6rdcDHb71rH/GgY0bMyCZKQCNnuMdy3uTaZeK2Fsxl3XGZzIWOGTEjmygBjZzlHsWmD2/ClvK32WHihAcdM2JGNlECGjnFPSJCQqqrjW86uxnDho4ZMSObKAGNHOMend8eJ24jfjq71crnLqBjRszIJkpAIz/cPWrRW+rdre+E2Y0t5zIbOmbEjGyiBDRyknsUw375cvTq+p5stfzSD3TMiBnZRAloJPc4LSqOvly3+2+NuXNt6JgRM7KJEtDISe5RhovT1v7db91+xf1fqdAxI2ZkEyWgkR/uHmmUOS6DSi/1bL/1F+/eDx0zYkY2UQIaOcs9Oput/+I1vSfbP8+tf0PHjJiRTZSARl6frgT/AEdsYuGEoHMxAAAAAElFTkSuQmCC"
        },
        {
            "code": "1000543856",
            "serialNo": "1000543856",
            "itemCode": "ADV-000005",
            "itemName": "T-Shirt Small (Black)",
            "batchNumber": "7656",
            "color": "BLACK",
            "printDate": "2026-06-22T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADwklEQVR4nO3dS47jMAwE0Nxg7n/LvkEGCJIWRVKeYJbm0yKAY6ssFMiq6JvHI5c/z0/5eV++vl7f/d5/pruPLwp0zIgZ2UQJaOTN3WPBrQrbR3rZxXsSFHTMiBnZRAlo5Ej3WA6bnojAL3P+YMYGbHXjJXTMiBnZRAloJPf4teT1kbq6H+stl1/6KnTMiBnZRAlo5Cz3+FTtQEr3d41GQ8eMmJFNlIBGco/GLz+99lI2h07Dz1+PYUPHjJiRTZSARt7XPWr9//74d4GOGTEjmygBjby1e0Sf3ay7jDJv9eNapmP5gY4ZMSObKAGNHOseqWpaBdzNvi702Il+A7+qQceMmJFNlIBGznKPd1k2vbl2qlBettVdl7lzDB0zYkY2UQIaOck9ygkTV13drl8cN8umVkDHjJiRTZSARg5yj9LVTY8dTn6Ir9uasrcROmbEjGyiBDRylnsUrz5sfV1I6263dTXWbX4JQMeMmJFNlIBG3to90rOlwvbu9ZbQut3E8wAzdMyIGdlECWjkJPfokdL+13qaU5ngraPM0DEjZmQTJaCR89wj9oHrjp3o6d2ZFGkF1MWCKOiYETOyiRLQyAnu0X51eWOZc7LpsuQYOmbEjGyiBDRymnv0m3Xq4fudu/dD0rGvDB0zYkY2UQIaOcs9er9NHdx6I+7dSe2BjhkxI5soAY2c7B5b/YtB59o5XsaeJnNDk6FjRszIJkpAIye5R3xif+veJY5uXM25r1F3DEHHjJiRTZSARt7bPQpwKnVnT7xc5aKvDR0zYkY2UQIaOcg96gLiiFk3xpaX1RLwoGNGzMgmSkAjx7lH/GoD6Tb1dGuh0toq6JgRM7KJEtDIye4RXTud63RYAdVjNrO80DEjZmQTJaCR49yjlM6Xu7uH4yhCU6BjRszIJkpAIye5x7qZVjZ1Nt2tlErd331GGDpmxIxsogQ0cqR7rMva340Vui2yqSmxQMeMmJFNlIBGznKPgnk4BzFO5m6zvAWsNAo6ZsSMbKIENHKMe6zHUoV+MLmz7u2vdaKdQ8eMmJFNlIBGTnOPznQTejHnOiSd10IdC3TMiBnZRAlo5M3dI/2Ja+oSb3O78cmK3r4HOmbEjGyiBDRynHtEw66LnyJSNz97+UsAOmbEjGyiBDRyunt007VlGfLy9HW3uQEdM2JGNlECGsk9jh3c7lynzT/TYRWtr0LHjJiRTZSARt7aPcqIct0xm54rD5+Og4KOGTEjmygBjZzlHnVYOHr11fqoeHkcg4aOGTEjmygBjXyOUYK/Pef7eMlTMRwAAAAASUVORK5CYII="
        },
        {
            "code": "1000556687",
            "serialNo": "1000556687",
            "itemCode": "ADV-000003",
            "itemName": "T-Shirt XL (Blue)",
            "batchNumber": "00125",
            "color": "BLACK",
            "printDate": "2026-06-22T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADw0lEQVR4nO3dUW7jMAwE0N5g73/L3iALBG5FkZTb/ppPH0EcW2OBGM6Usqx+fOT275Xb++f1bV3y/lbO3jboIoMzsokS0MiHu8cGd3XYel3tc7/4M55d3dKgoIsMzsgmSkAj57nHctjU/zp8f1vmvAZQ+8ZD6CKDM7KJEtBI7rFb8te3rsI9Fsc/+Cp0kcEZ2UQJaOQs97ibWy7l71ddC11kcEY2UQIayT1av3zLY50HLp6+zRf/eg4busjgjGyiBDTyue6RWnp4+qePnxt0kcEZ2UQJaOSj3SP67Gbdlzl3k7zL0w8A33YOXWRwRjZRAho51T1S11gDb3b+3TWgl/XJFwB0kcEZ2UQJaOQs90gOnVw79k/3XrfYVkWlm0EXGZyRTZSARg5zj82SV//owVvr6uL0kVCgiwzOyCZKQCOnuMfNkqc1wdwN4OjucYzQRQZnZBMloJGz3KNfXnx4a7UvmLvbxhFDFxmckU2UgEaOcY911C+DSk9lV0m8tVOtDF1kcEY2UQIaOcs9bpYS13ddy5uw23z1MnboIoMzsokS0Mih7tFtGpHmm6O719L5OBENXWRwRjZRAho5zz26ynfBpco32nm16fQgGLrI4IxsogQ0cp57lIr28EC2M/F+SjrWytBFBmdkEyWgkbPco/fbbo3T1qu8tpNejIUuMjgjmygBjRzqHtskcZxlXtXwXcEc+26PhaGLDM7IJkpAI+e5R7yiXlZcOz3HrbsU73jQRQZnZBMloJGz3CO1V9sOC6fKoPpaG7rI4IxsogQ0cqB7lCVPqba9u1lqEQ+6yOCMbKIENHKae8SfNpBoxN3mEsnJ6y4W0EUGZ2QTJaCR89wjHZWJ47oC6jgbncYDXWRwRjZRAho5zD26svb4Kk86e/cwN6y5gi4yOCObKAGNHOIesfJNeyMeNiNeDl0K4TI5DV1kcEY2UQIaOdA9SkncLSXeitsIl4YSG3SRwRnZRAlo5Cz3KJh1+6Z0GC/p3tgpg4IuMjgjmygBjRzjHrH/6pD+desvNnzq62LoIoMzsokS0MhZ7tGZbvHgtIxqu3c8W1ZaQRcZnJFNlIBGTnOPux0ROxO/WkVv7wNdZHBGNlECGjnOPaJhV3NOZW2pcm//EoAuMjgjmygBjZzuHmWh8brZ8ent6rafgC4yOCObKAGN5B7dHhLJdVdJvPln2rui9VXoIoMzsokS0MhHu0eaZe7mlo8zynEozXZQ0EUGZ2QTJaCRs9yjTgtHr67b/a+2gLuzbYMuMjgjmygBjXw9WAn+A/SzO/uCgMCBAAAAAElFTkSuQmCC"
        },
        {
            "code": "1000633168",
            "serialNo": "1000633168",
            "itemCode": "ADV-000003",
            "itemName": "T-Shirt XL (Blue)",
            "batchNumber": "00125",
            "color": "BLACK",
            "printDate": "2026-06-22T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAAD00lEQVR4nO3dUXIjIQwE0LlB7n/L3GC2kvIYkMQ4+zt6fGRtDzReldQdgSDHEdvXeZ7n93H8/HP+vn39OH4++33wPXcOXT406CzDZ0QTJsCRD1ePX7irhQEvpDHjNe12ihkKOsvwGdGECXBkS/WouwWFvu8SpPv9CjrL8BnRhAlwJPXIyjlr+ibr/R9dhc4yfEY0YQIc2Ug9jjXpXVae04OQSUNnGT4jmjABjmyuHlWPakV5fvVeR16/WbHKDJ1l+IxowgQ4spF6hJZT4r//+NygswyfEU2YAEc+Wj1mnd2kuq9+SxlUevBVokBnGT4jmjABjmyoHmMd+Ua6A3DY283Fw9BZhs+IJkyAIzuqx905naDks1bfif0bDzrL8BnRhAlwZDf1uNqnxeilXCp9tnzHSbmhswyfEU2YAEf2Uo9KtaurHgZcTo4rdd//TgCdZfiMaMIEOPKp6lGtKIfjsKHa+FMZ8pI1Q2cZPiOaMAGObKYe21GVkocceJHp8dk6I3SW4TOiCRPgyDbqETZpt7VQIf39dI8wdJbhM6IJE+DIvuoxf5TrntI8+QuEfm8U6CzDZ0QTJsCRvdRjK85hVJUSp1aURkFnGT4jmjABjmynHmGVeZv01nu74QusOg+dZfiMaMIEOLKTerzejRay3KX4eHSeC5I3Og+dZfiMaMIEOLKfeqRt2JHWVhVUOQdOufLoMp/igc4yfEY0YQIc2UE95h6bq5rqbDgoeXUCqEiaobMMnxFNmABHPl890jHXMOrKa+vd2yUvXodBZxk+I5owAY7sqh6p7jjfQzw/v1PyCQQ6y/AZ0YQJcGQv9QgXTixCPDDnp/n24aq26n06FjrL8BnRhAlwZC/1CH1f46tLhkPmuy2Nmq+Jgs4yfEY0YQIc2Ug9rlHz+EWIQwVymDFs3EJnGT4jmjABjuysHuPdFjjNfafa5X8AOsvwGdGECXBkE/UIq8dh6rBwHBLmsGdbLE5DZxk+I5owAY7spR43ar6chK0qkMPbua2lydBZhs+IJkyAI5uoR1LtfJFEVThVrzIXf94OOsvwGdGECXBkJ/Wo9Hb0SLu3S31U9XQAlVNAZxk+I5owAY58uHrkpDflu2PABZxqoXaqDZ1l+IxowgQ4sp16zK+qRDjLdJg2yP70FDrL8BnRhAlwJPXI9zqlRLj6uzk5Yd7pKnSW4TOiCRPgyDbqUafEFfptjfEmX4XOMnxGNGECHPlw9RitWgce4jyp8TS2Ojv7nhY6y/AZ0YQJcGQv9ahkNuS7Q6u3x3v+uPsKnWX4jGjCBDjyfDAT/ANz3iBPWsWOqwAAAABJRU5ErkJggg=="
        },
        {
            "code": "1000866727",
            "serialNo": "1000866727",
            "itemCode": "ADV-000003",
            "itemName": "T-Shirt XL (Blue)",
            "batchNumber": "00125",
            "color": "BLACK",
            "printDate": "2026-06-22T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADyElEQVR4nO3dUW7jMAwE0N5g73/L3sCLLeKIIqmk+xs+fRRtIo3UATkDyrL99ZXbn+u6ru/HH/9+v34+e/z5XTrHH+8bdMyIGdlECWjkh7vHD9zd+gH3jKtLnGcbEaGgY0bMyCZKQCNHukff7fudTccudT3QMSNmZBMloJHc4+ScwYhPVe//+Cp0zIgZ2UQJaOQg97g3mFfJtaZIVWqppKFjRszIJkpAI4e7R9ej8+pyWbe69m/2sKFjRszIJkpAIz/XPVKrJfHvf7xv0DEjZmQTJaCRH+0eV9tSDZxOMKWqudbFTxTomBEzsokS0MiB7rGQOuvuZ7zr3X4Bjy+gY0bMyCZKQCNHukfqdsNF4G1vOS6qtucqoGNGzMgmSkAjp7rHi+3ielyq/LYWEK0bOmbEjGyiBDRymntsn/ePeli1clcmJ8OOJ5WhY0bMyCZKQCNnucfqlpDWZ/0CnuNbdy5nmaFjRszIJkpAI2e4RzdqA+5PRW3mnAx7nxE6ZsSMbKIENHKMexQP3krdHu56/xxh6JgRM7KJEtDIue6xQJL9JqTjPbGxX7Ru6JgRM7KJEtDIWe7RHYMqhp2mfXE7bH6NHXTMiBnZRAlo5Dz36O7dSW6chsYv0pb0/hxi6JgRM7KJEtDISe4RHTq59vF5TelA8ub90DEjZmQTJaCRk93j3WXYNMW2/VwMu64COmbEjGyiBDRylHvEHvXm1jT+iFTW+Lw2DB0zYkY2UQIaOck90tXWMmrz7+4IVaqL42TQMSNmZBMloJHz3GO7O/br9FmaLAHHb8spK+iYETOyiRLQyDHukSrfblT5tnp1WdSjC3TMiBnZRAlo5Cz3iFZ7rGjTI4iTp29TtNeAoWNGzMgmSkAjh7hHb9g3ZhyfHLq7cHt6/CJ0zIgZ2UQJaOQQ9+iNPB2DqkejIki9laf9B6BjRszIJkpAIz/fPaLVbq69ZkznjlPncgz5bs9u0DEjZmQTJaCRY9zjCNydJ+6m6MrkfUsaOmbEjGyiBDRyjHssl01+W1y7e0fd+z1s6JgRM7KJEtDISe5RWvdwp238o9VvT3vY0DEjZmQTJaCRg9xjG1V6dO/NSTPWW2TDsqFjRszIJkpAI8e5Rz9+myLuQa+ldG1/CAV0zIgZ2UQJaCT3SC+lqzZdHHoriYMTH3wVOmbEjGyiBDRyjHv0JXF98P+xGt5rNOiYETOyiRLQyFnuEbd2mzfePM35eBdt3Cred5OhY0bMyCZKQCNnuUdns6neXXXx5t9lPS/9GzpmxIxsogQ08vp0JfgLFLncDvr+xv0AAAAASUVORK5CYII="
        },
        {
            "code": "1000911086",
            "serialNo": "1000911086",
            "itemCode": "ADV-000005",
            "itemName": "T-Shirt Small (Black)",
            "batchNumber": "7656",
            "color": "BLACK",
            "printDate": "2026-06-22T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADx0lEQVR4nO3dYVLrMAwE4N6A+9+SG+TNY2gtS3KAv9XnH9AQZ5PZkXaR7biPR24f13Vdn4/H/1/X1+H3j+3sOixdbht0zIgZ2UQJaOSbu8fXBc/WX7Du+PnTLSIUdMyIGdlECWjkSPfouy24asLdHQsUdMyIGdlECWgk9+jNNXr6oer9i69Cx4yYkU2UgEYOco/HN1wqf9ff4olUSUPHjJiRTZSARg53j65HNOznYHD89BpH3p/sN2PY0DEjZmQTJaCR7+seqdWS+Pc/fm7QMSNmZBMloJFv7R5X2+rip24FUzzx0aJAx4yYkU2UgEYOdI+EdJ6LDf3uqubXCeiYETOyiRLQyGnukeZn0yTtc7i4Oyxevb1XAh0zYkY2UQIaOdE9ju/Ebi0C1+0oTlUzdMyIGdlECWjkNPfYitmbrR6OL/psrr3bPnTMiBnZRAlo5Cz3WD32OnYbfk4l8f0y5K1qho4ZMSObKAGNHOYe6apn60aeo3VvL9CWWjneETpmxIxsogQ0cox7JIdOl3Y1cG/xaS0ydMyIGdlECWjkXPeI1r1hRqR6n/Io5cmgY0bMyCZKQCNnucdxZVMZaj58s01szXfpQMeMmJFNlIBGjnOPMitbVyD37t59bdzu89AxI2ZkEyWgkZPc4/toc+N+CLnb3KluTAEdM2JGNlECGjnZPW6mYY/vv26tf4pXcQwdM2JGNlECGjnJPUpZe3f9uk9CKs/4mhuGjhkxI5soAY2c5B7HKjdelfqlDSfSZsT9GDZ0zIgZ2UQJaOQE91g90rqn9LdgxHlGd3P8+DzQMSNmZBMloJGT3WO1etVeIGevTqPRry7QMSNmZBMloJHT3CNN1x53+r8bao52X7aJgo4ZMSObKAGNHOge0Y0Pw8oR4TBxCx0zYkY2UQIaOdk9ClIF7j5FkO227S2gY0bMyCZKQCOHuMdy3uTaq94txXE36bstNH4NTkPHjJiRTZSARs5yj8610+ztcQVyOlxQ+b8A6JgRM7KJEtDIIe6xXDb67WHnxNIljTI3X28HHTNiRjZRAho5yT1KO2yQWB4lna0TvO0toGNGzMgmSkAj39w9VtFba9tlxKWGvntFNpfZ0DEjZmQTJaCRk9yjv367Rbx0O+xsP5yFjhkxI5soAY3kHmkjp7TuadtfuCuJV8F88lXomBEzsokS0Mgx7tGXxB36cavEWL1Cx4yYkU2UgEbOco80yhyXQXUv9dS3aGPnfTQZOmbEjGyiBDRylnt0Nls39C9vwnbPc+vf0DEjZmQTJaCR17srwT/1inS0lFYC1QAAAABJRU5ErkJggg=="
        },
        {
            "code": "1000933905",
            "serialNo": "1000933905",
            "itemCode": "ADV-000018",
            "itemName": "Reflat (Retail)",
            "batchNumber": "03462",
            "color": "White",
            "printDate": "2026-06-24T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADw0lEQVR4nO3dS47jMAwE0Nyg73/LuUEGGMQRRVLuzDZ8WgRB2yoLRLEq1Mf9eOT283w+n39e3+LH4/F4XdhuTrf80qCLDM7IJkpAI7/cPf7BXa3vcD0x3rmes/WIUNBFBmdkEyWgkSPd43hb58NrFK8nJovfQaGLDM7IJkpAI7nHT3HO6OmHqvd/fBW6yOCMbKIENHKQe1wlRqlNUzXcVdLQRQZnZBMloJHD3aO7I3r11RJm59oRCrrI4IxsogQ0cp57pFZL4s8/fm/QRQZnZBMloJFf7R7RZ7tSd80yb9ugli93dfEbBbrI4IxsogQ0cqB7LKSjdZcnXqPoB/B6LHSRwRnZRAlo5DT3uP6UdkD1s8x1bnm1eMtrFNBFBmdkEyWgkdPc43gmdmtd/7TUe+4FXWRwRjZRAho5xj061+5e9XAsk7e2BnD+TQBdZHBGNlECGvmt7nGcUd7L2jqAd//Wnfe3OUEXGZyRTZSARo5xj2Ovu11RyZxLrRyfCF1kcEY2UQIaOcY9OswEUuC2WeZuQxR0kcEZ2UQJaORk94h/WnXsOqyzzSh3S73xQkSBLjI4I5soAY2c5R7dNqhUHEfg1frjsNu/sYMuMjgjmygBjRzpHrEkTmu2d6djk5OnC9BFBmdkEyWgkfPco7jxcvJ0RGfZdNqQvHk/dJHBGdlECWjkZPfo9hjHvcNlB1V+r2JZwt1GAV1kcEY2UQIaOco94h3pcGvtf0Tqxrh7OHSRwRnZRAlo5Bj3iJZ893/myszz6ntTa0MXGZyRTZSARo5xj2LEVzueeu1XdNPVMiboIoMzsokS0MgJ7pF2Ficj7q8exllufp+9hS4yOCObKAGNHOMe3Tv6D2diS+V73Br1fk0UdJHBGdlECWjkQPeo883dtPJy6JuF21hYQxcZnJFNlIBGznKP1Y7A3beja5eFYOgigzOyiRLQyEHucXTt4sG1YC77jtO7K25+E0AXGZyRTZSARn6le9y4ed1PHMvfZmfxGyrhQRcZnJFNlIBGTnGP5bLRb+uccX9Lt8pbVm+hiwzOyCZKQCPHuMenL0hMIH2ZXDcfQxcZnJFNlIBGDnOP1SGVutvp2FJD3x2RzWU2dJHBGdlECWjkJPfo+2+PWF6dkDrbD1ehiwzOyCZKQCO5x3YSp/fl50cF88lXoYsMzsgmSkAjx7hHXxKnCebudf9NDQtdZHBGNlECGjnOPVbrXDs+J11IZ3ea6WfoIoMzsokS0MhZ7tHZbKqGO68+jud29RW6yOCMbKIENPL5xUrwF7RADvrKGFQEAAAAAElFTkSuQmCC"
        },
        {
            "code": "1000934596",
            "serialNo": "1000934596",
            "itemCode": "ADV-000003",
            "itemName": "T-Shirt XL (Blue)",
            "batchNumber": "00125",
            "color": "BLACK",
            "printDate": "2026-06-22T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAAD0UlEQVR4nO3dW47qQAxFUWZw5z/LnkGuhEjKZTvQ/YtXfSDI4xSy7LPlIgmPRx7/juM4fh6P18txHM9tz31rxzo4vnwe1EVGzqgmTsAjv5weT7lzpBNeSmvG85DbKaIUdZGRM6qJE/DIkfToD/vpIZwOWV+gSFEXGTmjmjgBj0SPvv1NffEb4P6Kq9RFRs6oJk7AIwfR4yl89N1w6lJLJ01dZOSMauIEPHI4PbojIrDPFeGk2VH7N2vY1EVGzqgmTsAjv5ceaaSW+E8vnwd1kZEzqokT8MivpsfRjgrnchnTRvcE7EuFusjIGdXECXjkQHqUSxYrktN6c1x5rl3zNS11kZEzqokT8MiR9KhXQMV328f0BRLn9+9DXWTkjGriBDxyID36+6u2zjd+izRF1ytf5KYuMnJGNXECHjmLHrWj7SbruFzWltfVU6+P1EVGzqgmTsAjZ9EjInlbUV7b0tXGqWFO1M5dM3WRkTOqiRPwyFn06M7ahMtPs/UG2q5Xvs6gLjJyRjVxAh45hh6Fwd2NOdu7HvF1lZm6yMgZ1cQJeORQekR0p1PTkyjqg//Ljohu6iIjZ1QTJ+CRs+jRw3mNNM+n22G3G32oi4ycUU2cgEeOpMebC6Jumt6F6fiuefo/dZGRM6qJE/DISfRYNE6YXlsSptO2RHzqIiNnVBMn4JGT6VG4vE3Wy9X/AUjED80xdZGRM6qJE/DISfTo29ptpIXjTunuO1IXGTmjmjgBj5xFj+7U1PmufrdH99YXx8moi4ycUU2cgEdOo8c6It2J0/9ce86TJit741nURUbOqCZOwCPH0CO1sAnE66ytPy6sjtTe77alLjJyRjVxAh45iR6v89/d61owvYH9doqsRF1k5Ixq4gQ8cgI9mkfxX8cmnEfhta3e6ENdZOSMauIEPHIoPdYUnXC5XCr9UlupXX4Ipi4yckY1cQIeOYge8dSN2oXBtWEu1x0XxFMXGTmjmjgBj5xFj3RsonHc8f5hxGuUJWnqIiNnVBMn4JFj6LEom3ibqF0O6W6MTY+oaK6loi4yckY1cQIe+dX0KKN73HDqgZ/j9lHF52inoC4yckY1cQIe+eX0qM88LP3uOe0SLi31HbWpi4ycUU2cgEeOo0cH7HVY1Nzmqcive6mLjJxRTZyAR6LHzU2wadE57U3rzVc3fEtt6iIjZ1QTJ+CRE+gRu+HtD1vXWXFb96jE2L1SFxk5o5o4AY+cRY+0ytyt/iZWx3PTwTv7qYuMnFFNnIBHzqJHh9n6QP+e3+/+3bVKUxcZOaOaOAGPPL7bCf4DFLcyIho6JKIAAAAASUVORK5CYII="
        },
        {
            "code": "1001016071",
            "serialNo": "1001016071",
            "itemCode": "ADV-000003",
            "itemName": "T-Shirt XL (Blue)",
            "batchNumber": "00125",
            "color": "BLACK",
            "printDate": "2026-06-22T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADw0lEQVR4nO3dUW7jMAwE0Nyg979lbqDFBptIIiln+2s+fQRJbY8MgpwBKUp9POL4GWOM5+fbGOP17XXt38/t5vXj+4DOMnxGNGECHHlz9XiDrEjvj3We51/018f4XMhTrFDQWYbPiCZMgCNbqsfFbROkuuU9Y5LuzzfoLMNnRBMmwJHUY6a/m1ZfpNS/VA/oLMNnRBMmwJGN1ONdUZ6YIREOheg0N3SW4TOiCRPgyL7qUd1RVZTTsm5W7aLKDJ1l+IxowgQ4spF6hBFS4l99fB/QWYbPiCZMgCNvrR6jHFmcQwdTuvBTokBnGT4jmjABjmyoHrOOXEl3PWPoQH4WLwCdZfiMaMIEOLK5eqRF2k3JV62udH57M+gsw2dEEybAkW3VI2h1NbZ2qWNKvD8DnWX4jGjCBDiym3rkjLY66iH9rS4rB9mHzjJ8RjRhAhzZSz2q9qawHTZ0G1dl5XTLfpoTdJbhM6IJE+DINuoRLr5HVXmu8uKq/LyDQmcZPiOaMAGObKMeMXstiskJbjuluGqIgs4yfEY0YQIc2Vk9pnQHzIB03BO73re+GXSW4TOiCRPgyF7qUbVBpdy22id7WL2NG4KgswyfEU2YAEe2U4+0Y6dCD8u1Ydq86AudZfiMaMIEOLKfekykdRwajac4h5L0KS+GzjJ8RjRhAhzZSz2qHuN1Lfawi2dV9/wfzhcU6CzDZ0QTJsCRndRjvWP79h9beaoF3n0NGDrL8BnRhAlwZC/1qB5NT+X7ovRfZcPQWYbPiCZMgCPbqMeq0OlQ/nLX6/xZtkFtXVbQWYbPiCZMgCO7qUc42jA8dTjGv0B6fDmDETrL8BnRhAlw5P3VY+2AOuXLMfPNpeZqimV+6CzDZ0QTJsCRTdRjPhWeX7Pcbe4wY1q4hc4yfEY0YQIc2Vc9whQVcPVtKnRQ96Df0FmGz4gmTIAjW6nHUbVDzbhKmI99x59CNHSW4TOiCRPgyF7qUal2eODYgRx+rtK9dkpBZxk+I5owAY5sox6jGEm1c+NUXWUOBxSnXiroLMNnRBMmwJE3V480thJyKivPEa7mBd5yCugsw2dEEybAkTdXj3zm4YoeduzkTqmUK++vDZ1l+IxowgQ4sp16VM+vRedNpkPWXMn+chU6y/AZ0YQJcCT1yAXmqitqVegtJZ5KfKmr0FmGz4gmTIAjO6hHnRLnw52O2fCeo0FnGT4jmjABjuylHqHKfLGpJzxf3byXn6GzDJ8RTZgAR/ZSj0pmr9ZXL97nUr+hswyfEU2YAEeOuzPBH+K5jcQgIcsOAAAAAElFTkSuQmCC"
        },
        {
            "code": "1001132443",
            "serialNo": "1001132443",
            "itemCode": "ADV-000018",
            "itemName": "Reflat (Retail)",
            "batchNumber": "03462",
            "color": "White",
            "printDate": "2026-06-24T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADyUlEQVR4nO3dUW7jMAxF0exg9r/L2YELBHZNkVTa/ppHH0Uztp8Ngny3VGTN65XHv+M4jv/nb/HH6/V6HziPvvpTfhjURUbOqCZOwCMfTo+33DX6c687xjM3t4hS1EVGzqgmTsAjR9KjPy0RerlZOSU91Pdv1EVGzqgmTsAj0aO2v5Hpm673L1ylLjJyRjVxAh45iB5v4aVD7rvhrpOmLjJyRjVxAh45nB7dGRHY12RwP+e7PFkzy0xdZOSMauIEPHIQPdJILfGffvw8qIuMnFFNnIBHPpoekbNdq1vRHZ9iIXmjQl1k5Ixq4gQ8ciA9bqWC7utjEvncNX8foC4yckY1cQIeOY0ey8H4Je29Fuq+4PpYvsxNV5zPQ11k5Ixq4gQ8cho97us/T0Yvy6Uiv1NLHNFNXWTkjGriBDxyGj2WJU8ftnqoD9BROx44/yagLjJyRjVxAh45hh5l4nh5YyeBuGudezqXtczURUbOqCZOwCNn0KNuLtGvikpd8wLn2BenDpm6yMgZ1cQJeOQgevSX7vZm2iO+7iNMXWTkjGriBDxyKD26S+/xi3di43kR3dRFRs6oJk7AI2fRYwvnBPHC5f512LI0irrIyBnVxAl45Dh6dO/kJDjHlVLdkuP6pS91kZEzqokT8Mh59Dg/pdFNIXebO1XOUxcZOaOaOAGPnEyPD1/DpnnkOhtdgJ32Szzf4qEuMnJGNXECHjmGHn1bW/viDt3pstIS75pm6iIjZ1QTJ+CRT6VH+ra1XLV0yLEHXtH/qRumLjJyRjVxAh45iB7L27H3SC/Lppsl4dJEN0rURUbOqCZOwCNn0eMem10nulNWpbp3BXWRkTOqiRPwyEH0OGm8fdd1s+S4Xxq13KJVoi4yckY1cQIeOYEeqcF9jyTXTTpv9nWiLjJyRjVxAh45lB4NalvhrgfeUrvoURcZOaOaOAGPnEGPm7yJ2mmCuWuYy7rjgnjqIiNnVBMn4JGz6JHOTTROrI736VcWd/sqUhcZOaOaOAGPHEOPoxmF2nVpVD/L3Pz3dtRFRs6oJk7AIyfR47cbJJZHSUeXXnl/C+oiI2dUEyfgkQ+nR93zsPS7121v4X4FckNt6iIjZ1QTJ+CR4+hRgL1wOWou6K7IL/ehLjJyRjVxAh6JHruXYCNwE6HTW7TfJO6oTV1k5Ixq4gQ8chI9ylRzXZAc/237Am3/Vyp1kZEzqokT8MiH0yNO7SbNa0R+p2vTVPHKfuoiI2dUEyfgkbPo0WE29bs3q+tOFNuuuUpTFxk5o5o4AY88nu0EX64PzndNw8BwAAAAAElFTkSuQmCC"
        },
        {
            "code": "1001149132",
            "serialNo": "1001149132",
            "itemCode": "ADV-000018",
            "itemName": "Reflat (Retail)",
            "batchNumber": "03462",
            "color": "White",
            "printDate": "2026-06-24T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADzElEQVR4nO3dYY7rIAwE4Nxg73/LvUGe1NcEsE2q/Vt//Ki2GxgiazwjE0KPI7af8zzP3+M47/b63+va+8Lv3Hn++NygiwzOyCZKQCO/3D1ecAEp9B0zjmk3U8xQ0EUGZ2QTJaCRLd3jodsAudq4i9nEw03df0EXGZyRTZSARnKPXP6Guriqev/iq9BFBmdkEyWgkY3c4yoxUm062lWlVqvR0EUGZ2QTJaCRnd2j6jEb9rUYHDAr156hoIsMzsgmSkAj+7lHaKEk/tPH5wZdZHBGNlECGvnV7jH77KbUffdbtkGlCz8lCnSRwRnZRAloZEP3GOvIW+tOMz5VzfcF6CKDM7KJEtDIlu6Rd0CFvVDz1/DixNJ5HQFdZHBGNlECGtnVPT4tRi/bpbYl8ToGusjgjGyiBDSym3uMKjeUtdWj2fw1tHED/10busjgjGyiBDSyk3ukheNQ+S7Lz9sjnVKXtJcZusjgjGyiBDSyh3uEi2NUPhuxqovr5ecZFLrI4IxsogQ0so17BIdOle/4a3n/NVl8dY4wdJHBGdlECWhkS/eYPTgMrU5pysvPod9t3dBFBmdkEyWgkb3cY2vT4RHuXCaPLqEtRTR0kcEZ2UQJaGRT9wgbooJ1h8nSs93qRZ/7RqGLDM7IJkpAIzu5x/tbaNUSct4fVTk+dJHBGdlECWhkZ/dISNVp/QEu/w5Auou7OIYuMjgjmygBjezkHqmsrXYRV9VwdWhiukfoIoMzsokS0Mhe7rGtciv/fnii+1ANQxcZnJFNlIBGtnGP2aHTofzl+6/VZGG71AQCXWRwRjZRAhrZyT0S0mLEYadU1SVghpuCLjI4I5soAY1s5h7PO5s2lW9Yag5OPpk4dJHBGdlECWhkJ/cYSKuRxzd23v1Ghbs9omI9fhG6yOCMbKIENLKTe4xvFXCaIjypDa69tFhrQxcZnJFNlIBGfr97jFHBtecF5nxWxTwsPMKd/Ru6yOCMbKIENLKXexyftxynUbt9yzdU3CkFXWRwRjZRAhrZxD3OoqUNUXlrVJrsYQ0busjgjGyiBDSyjXukFn4FZ3kdNjh5dXUAlVNAFxmckU2UgEZ+uXvkMw/DM9t5wAWcSuqda0MXGZyRTZSARrZzj2DY2xp4/3x2tf3pKnSRwRnZRAloJPcIBzllm04OvXuVduur0EUGZ2QTJaCRTdyjRsqHO22r4bVGgy4yOCObKAGN7OUeo1XrwMOc58Xg4/Hd2Xta6CKDM7KJEtDIXu5R2Wyod6+h6fWep193zdDQRQZnZBMloJHndyvBPwMh2fBhoxk2AAAAAElFTkSuQmCC"
        },
        {
            "code": "1001268200",
            "serialNo": "1001268200",
            "itemCode": "ADV-000005",
            "itemName": "T-Shirt Small (Black)",
            "batchNumber": "7656",
            "color": "BLACK",
            "printDate": "2026-06-22T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAAD0UlEQVR4nO3cW27rMAwE0Oyg+99ld+ALFHEkkZTa+2sefQRJY49cgjMT6vV6xfZ1Xdf1/X43v9zt/e3rcMm+QRcZOYNNlIBGPtw9fuDuFq4d/fy8m6/cdDFDQRcZOYNNlIBGtnSP+rJx/9LGU7x7DBa/gkIXGTmDTZSARnKPxVyHYR9K6v90D+giI2ewiRLQyEbucZcYqTa9C+G5TA6VNHSRkTPYRAloZHP3qK6YDfseEZ7ffcaR1ycrRpmhi4ycwSZKQCMbuUdouST++8vvDbrIyBlsogQ08tHucZUtlLqLdY/b3u9yXfy5DbrIyBlsogQ0sqF7jHHkZN3DevO644FePwB0kZEz2EQJaGQ/91iGkNMkbQDJH4PZr08LXWTkDDZRAhrZzT2u34eL71I3FcJVSTxbN3SRkTPYRAloZDf3qFx7e5pTtdFnY9373wTQRUbOYBMloJFPdY/ZksOe2FHWViPKn/tLd05rmaGLjJzBJkpAI3u4R96dMwOHUyeGdS/TuocKGbrIyBlsogQ0spF7BIc+1MC57/AAoUEXGTmDTZSARjZ1j3TrjXnoNi9ITh93Pwegi4ycwSZKQCOf6h7zn/JRTXNdfFe+oe+5FUujoIuMnMEmSkAj27lHGkzObhzq3dBtNekLXWTkDDZRAhrZzz2GQ88tlLrbw502A9HQRUbOYBMloJFN3aNeYxzMeamVQyGcpnDX0hm6yMgZbKIENLKTe9Rl7dJCNVwh7Z4RusjIGWyiBDSyoXukba7LntjZq5fjKOZ7D7U2dJGRM9hECWhkG/dIxewohDe7XoNDp7nd9ZhF6CIjZ7CJEtDIXu6xIAUjDsulzrO36eL5TAvoIiNnsIkS0MgO7pHceLvX9TTUvPsBAF1k5Aw2UQIa2dA9kmEv14bFx/O3YeK2OH4RusjIGWyiBDSyk3vMXWyAU995e0+6rfgHoIuMnMEmSkAjn+8eW9cOY8bBusfFaQp39m/oIiNnsIkS0Mhe7nFw87yeeO6nWFn8gYorpaCLjJzBJkpAI5u4R3LtZaS4XhWV99P+eQwbusjIGWyiBDTy0e6RWjg+ohpHvopv8wRv2QV0kZEz2EQJaOTD3SOfeTi79mlP7HZsOZbZ0EVGzmATJaCRndwj3Z+PIK7q4mz5qR/oIiNnsIkS0EjusRp2NZlbfRuM+VMN12U2dJGRM9hECWhkE/eoVhbX6Mc1xpt6FbrIyBlsogQ08uHuMQ/tng8jDtO9i8WXw8/QRUbOYBMloJG93KOy2QVp9up8EkW1hKr0b+giI2ewiRLQyOvpSvAPqQ+rEIhNJxAAAAAASUVORK5CYII="
        },
        {
            "code": "1001317867",
            "serialNo": "1001317867",
            "itemCode": "ADV-000003",
            "itemName": "T-Shirt XL (Blue)",
            "batchNumber": "00125",
            "color": "BLACK",
            "printDate": "2026-06-22T00:00:00",
            "warrantyPeriod": 12,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAADwUlEQVR4nO3dUY7iQAyE4bnB3v+Wc4OsxALptivAvuKvH9BAkgqy7L/GSXf4+anjz3Ecx+/Pz/3lOI7bZ22/x87ry/tBXWTkjGpCAoz8cve4yT1G2fd2inTG+4Z+ilWKusjIGdWEBBg50j3ybr/vbPo8Y7Pu51/URUbOqCYkwEju0Z1zMeI3ffFHvkpdZOSMakICjBzkHrdGeOuQSyO8tsmlk6YuMnJGNSEBRg53j7THKvIY59tm4v9zDZu6yMgZ1YQEGPm97lFGb4k/f3k/qIuMnFFNSICRX+0eRxzbXKj7fts0qNOXU1/8VKEuMnJGNSEBRg50j6KU7sW2M/auObTO1EVGzqgmJMDIae7xap3O+tc2NWr9Uo+x2vldj7rIyBnVhAQYOc09Hse/vhh9KVxa4nAUdZGRM6oJCTBykHsk1748WWqTy1jNnrrIyBnVhAQYOcs90vSmtfPt5pwuK5e/ziOoi4ycUU1IgJHD3KOvzlmF063ZsoA2XX5eRamLjJxRTUiAkWPco3avcWFO8fTtKcVpQhR1kZEzqgkJMHKye+Q+tivll+2O7m7d1EVGzqgmJMDIWe5xOQ2qGHZqiT9YVEtdZOSMakICjJznHm2dzkXT++Lebt9AXWTkjGpCAoyc5x73d92mz0/eTUjevJ+6yMgZ1YQEGDnZPVK/u8q1GVTxdwDSYf/eUhcZOaOakAAjJ7lHbmu3kbvh8gXSCqCrppm6yMgZ1YQEGPmt7lHutibDXr06WXd5GHG+hk1dZOSMakICjJzlHmUlTlneU05WhNet+ywr6iIjZ1QTEmDkVPd4NW24bQ1K4UtRFxk5o5qQACNHuUfy2/tn/akTydjLfvs/ANRFRs6oJiTAyGnuESZK7ftmh75c6BMev0hdZOSMakICjBziHs2Di3CZJFXu1BbXvtSjLjJyRjUhAUbOcI/TeYtrp0U9pWHOa3ce47kbdZGRM6oJCTByjHs0m77skEv7m65Gn4a9fVHqIiNnVBMSYOQU92hm++qXXNdd0lXm8PN21EVGzqgmJMDISe7x0WP8t5/HeVpy3LpadzgFdZGRM6oJCTDyy92jP/Ow9bvnAQ/hNhfqyrWpi4ycUU1IgJHj3KMZ9ubLq+bWP3fLb+ehLjJyRjUhAUZyj22Fa7yZ2xz6omGOvkpdZOSMakICjJzkHu08fULy+lnvhvcejbrIyBnVhAQYOcs91ku7rx9GXG73licshsvP1EVGzqgmJMDIWe6RbLb0u69WwqYpVNG/qYuMnFFNSICRx7eT4C94R2MgA4Hn/gAAAABJRU5ErkJggg=="
        },
        {
            "code": "1001382630",
            "serialNo": "1001382630",
            "itemCode": "IN-003475",
            "itemName": "R-7010 (Blue)",
            "batchNumber": "10001",
            "color": "BLACK",
            "printDate": "2026-06-22T00:00:00",
            "warrantyPeriod": 13,
            "wStartDate": null,
            "wEndDate": null,
            "claimCount": 0,
            "itemStatus": "Available",
            "claimStatus": "None",
            "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAuQAAALkAQMAAAB9arImAAAABlBMVEUlQI/p6u3D1r3iAAAD10lEQVR4nO3dW3IrMQgEUO/g7n+X2cHcSsq2ECA7+TVHH3l4pJ4pCroLBsm3Wx7/ruu6vm6371/Xz7/3H7fvz77K5DTlzYDOMnxGNGECHPnh6vED9xhpwR1u3XH7t7tFhILOMnxGNGECHDlSPfppC64qcXfHAgWdZfiMaMIEOJJ6lPQ3JsfH8Uddhc4yfEY0YQIcOUg9foC3DHndouTFKZOGzjJ8RjRhAhw5XD26GQlufZbX70/WVJmhswyfEU2YAEcOUo80Ukr8px/vB3SW4TOiCRPgyI9Wj6sdKdVNHUxdB/Im2M9l0FmGz4gmTIAjB6rHqiP367s7Xs0L3q15GDrL8BnRhAlw5ET12ErI5SXtVi6OmJ3Oryn3p4XOMnxGNGECHDlNPdb6Y7m4ini80B1HUR4HOsvwGdGECXDkDPWo50qUbczb+RNdQ3LS7+df0FmGz4gmTIAjZ6lH194UE+FHWXmJ8Os25JxEQ2cZPiOaMAGOnKUe6eJalZS8y4E3mU658hMUOsvwGdGECXDkGPWIGlxPH45w2/7XIvG1ygydZfiMaMIEOHKoeiyQJM79HesDxHlRuqGzDJ8RTZgAR85SjyLO3aFNtdS8Pouj+S4d6CzDZ0QTJsCR49SjvJV9zF1qnJLeeKEeUBweGTrL8BnRhAlw5CT1WGrc5cCp+biT7qL40FmGz4gmTIAj56rHu9ewhwx5jeNT7Lt4oLMMnxFNmABHTlCPPq3dRiwcH5W82wF0SpqhswyfEU2YAEd+tHqUba6pP2ppdSfdW14cbwadZfiMaMIEOHKaehwT4V+cQ9y2QYXKM3SW4TOiCRPgyGnqcWyISrocr1at7nurnntvobMMnxFNmABHDlGPd51NtUkqyXEP8HKPEHSW4TOiCRPgyE9Vj16wNyHuis5rfnkK6CzDZ0QTJsCRc9UjLngNvH0WV2xF6/IiGDrL8BnRhAlw5CD1iIK9qXZXfk4Jc9d3HCefatPQWYbPiCZMgCM/VT2KTB/OQSw7dprO4iDd24NCZxk+I5owAY6coh5FbOtBEl1XVL8xtqlhQ2cZPiOaMAGOnKQeZWwl5FhHTvluvXqsN0NnGT4jmjABjpyjHjXpjeiv9sQeG6dymg2dZfiMaMIEOHKSesS/0hkS9U1tfJRu7K3J0FmGz4gmTIAjqUc6yKnT5e57c1LW3Jw6sZ1PDJ1l+IxowgQ4coJ69ClxPa/pmA3vORp0luEzogkT4MhZ6vG6IarcJ63dj0VM1WToLMNnRBMmwJGz1KOT2QS88uL6RXVlxUm/obMMnxFNmABHXp/OBP8BqgbOOHFTDokAAAAASUVORK5CYII="
        }
    ],
    "page": 1,
    "pageSize": 20,
    "totalCount": 166768,
    "totalPages": 8339
}
  }
    // throw error
  


};


export const fetchWarrantyMasterDataFromApi = async ({ page, pageSize }: any) => {
  const res = await axios.get(
    `https://jsonplaceholder.typicode.com/comments?_page=${page}&_limit=${pageSize}`
  );
  return res.data;
};









// import { useMemo, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import {
//   ChevronDown,
//   ChevronUp,
//   ChevronsUpDown,
// } from "lucide-react";

// export type DataTableColumn<T> = {
//   id: string;
//   header: string;
//   accessor: (row: T) => string | number;
//   cell?: (row: T) => React.ReactNode;
//   sortable?: boolean;
//   className?: string;
// };

// type SortDir = "asc" | "desc";

// type DataTableProps<T> = {
//   columns: DataTableColumn<T>[];
//   data?:any,
//   queryKey: any[];
//   queryFn: () => Promise<T[]>;
//   searchPlaceholder?: string;
//   pageSize?: number;
//   emptyMessage?: string;
//   dummyData?: T[];
  
// };

// export function DataTable<T extends { id: string }>({
//   columns,
//   queryKey,
//   queryFn,
//   data:datas,
//   searchPlaceholder = "Search…",
//   pageSize = 10,
//   emptyMessage = "No records found.",
//   dummyData = [],
// }: DataTableProps<T>) {
//   const [search, setSearch] = useState("");
//   const [sortCol, setSortCol] = useState<string | null>(null);
//   const [sortDir, setSortDir] = useState<SortDir>("asc");
//   const [page, setPage] = useState(1);

//   // =========================
//   // QUERY
//   // =========================
//   const {
//     data = [],
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey,
//     queryFn,
//   });

//   const sourceData: T[] = isLoading ? dummyData : data;

//   // =========================
//   // FILTER + SORT
//   // =========================
//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     let rows = [...sourceData];

//     if (q) {
//       rows = rows.filter((row) =>
//         columns.some((col) =>
//           String(col.accessor(row)).toLowerCase().includes(q)
//         )
//       );
//     }

//     if (sortCol) {
//       const col = columns.find((c) => c.id === sortCol);
//       if (col) {
//         rows.sort((a, b) => {
//           const av = col.accessor(a);
//           const bv = col.accessor(b);

//           const cmp = String(av).localeCompare(String(bv), undefined, {
//             numeric: true,
//           });

//           return sortDir === "asc" ? cmp : -cmp;
//         });
//       }
//     }

//     return rows;
//   }, [sourceData, search, sortCol, sortDir, columns]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
//   const currentPage = Math.min(page, totalPages);

//   const pageRows = filtered.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   function toggleSort(colId: string) {
//     if (sortCol === colId) {
//       setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//     } else {
//       setSortCol(colId);
//       setSortDir("asc");
//     }
//   }

//   // =========================
//   // Skeleton rows
//   // =========================
//   const renderSkeleton = () =>
//     Array.from({ length: pageSize }).map((_, i) => (
//       <tr key={i} className="animate-pulse">
//         {columns.map((col) => (
//           <td key={col.id} className="px-4 py-3">
//             <div className="h-3 w-full rounded bg-slate-200" />
//           </td>
//         ))}
//       </tr>
//     ));

//   // =========================
//   // ERROR ROW (inside table)
//   // =========================
//   const renderErrorRow = () => (
//     <tr>
//       <td colSpan={columns.length} className="px-4 py-10">
//         <div className="flex flex-col items-center justify-center text-center text-sm text-red-600">
//           <div className="rounded bg-red-50 px-4 py-3 border border-red-200">
//             Failed to load data: {(error as Error)?.message}
//           </div>
//         </div>
//       </td>
//     </tr>
//   );

//   return (
//     <div className="space-y-3">
//       {/* SEARCH (ALWAYS VISIBLE) */}
//       <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//         <input
//           type="search"
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setPage(1);
//           }}
//           placeholder={searchPlaceholder}
//           className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm sm:max-w-xs"
//         />

//         <p className="text-xs text-slate-500">
//           {filtered.length} record(s) · page {currentPage} of {totalPages}
//         </p>
//       </div>

//       {/* TABLE */}
//       <div className="overflow-x-auto rounded-lg border border-slate-200">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="border-b bg-slate-50 text-left text-xs uppercase text-slate-500">
//               {columns.map((col) => (
//                 <th key={col.id} className={`px-4 py-3 ${col.className ?? ""}`}>
//                   {col.sortable !== false ? (
//                     <button
//                       onClick={() => toggleSort(col.id)}
//                       className="inline-flex items-center gap-1 hover:text-slate-800"
//                     >
//                       {col.header}
//                       {sortCol === col.id ? (
//                         sortDir === "asc" ? (
//                           <ChevronUp className="h-3.5 w-3.5" />
//                         ) : (
//                           <ChevronDown className="h-3.5 w-3.5" />
//                         )
//                       ) : (
//                         <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
//                       )}
//                     </button>
//                   ) : (
//                     col.header
//                   )}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody className="divide-y bg-white">
//             {/* ERROR STATE INSIDE TABLE */}
//             {isError ? (
//               renderErrorRow()
//             ) : isLoading ? (
//               renderSkeleton()
//             ) : pageRows.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={columns.length}
//                   className="px-4 py-10 text-center text-slate-400"
//                 >
//                   {emptyMessage}
//                 </td>
//               </tr>
//             ) : (
//               pageRows.map((row) => (
//                 <tr key={row.id} className="hover:bg-slate-50/50">
//                   {columns.map((col) => (
//                     <td key={col.id} className={`px-4 py-3 ${col.className ?? ""}`}>
//                       {col.cell ? col.cell(row) : col.accessor(row)}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* PAGINATION */}
//       {!isLoading && !isError && totalPages > 1 && (
//         <div className="flex items-center justify-end gap-2">
//           <button
//             disabled={currentPage <= 1}
//             onClick={() => setPage((p) => p - 1)}
//             className="rounded border px-3 py-1 text-xs disabled:opacity-40"
//           >
//             Previous
//           </button>

//           <button
//             disabled={currentPage >= totalPages}
//             onClick={() => setPage((p) => p + 1)}
//             className="rounded border px-3 py-1 text-xs disabled:opacity-40"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }



// warranty serial master final with dummy and error handling