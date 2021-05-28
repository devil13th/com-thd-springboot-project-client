const constants =  {
    CLASSIFYMAP:{},
    CLASSIFY:[
        {
            name:"JAVA",
            value:"JAVA",
            color:"#108ee9"
        },
        {
            name:"Spring Boot",
            value:"Spring Boot",
            color:"#87d068"
        },
        {
            name:"ElasticSearch",
            value:"ElasticSearch",
            color:"#2db7f5"
        },
        {
            name:"Redis",
            value:"Redis",
            color:"#f50"
        }
    ]
}

constants.CLASSIFY.forEach(item => {
    constants.CLASSIFYMAP[item.value] = item
})

export default constants