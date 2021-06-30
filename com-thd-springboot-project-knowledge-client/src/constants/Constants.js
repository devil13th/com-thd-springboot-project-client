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
            name:"RabbitMQ",
            value:"RabbitMQ",
            color:"#2db7f5"
        },
        {
            name:"Redis",
            value:"Redis",
            color:"#2db7f5"
        },
        {
            name:"THD TEC",
            value:"THD TEC",
            color:"#f50"
        },
        {
            name:"Note",
            value:"Note",
            color:"#f50"
        }
    ]
}

constants.CLASSIFY.forEach(item => {
    constants.CLASSIFYMAP[item.value] = item
})

export default constants