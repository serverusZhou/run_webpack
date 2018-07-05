/**
 * 配置多页面入口参数
 * @author arvin
 * 
 * 此文件修改需重新编译打包
 */
module.exports = [
    {
        jsEntryPath: 'pages/index/index_entry',
        templateFileName: 'index',
    },
    {
        jsEntryPath: 'pages/yueba/index_entry',
        templateFileName: 'yueba',
    },
    {
        jsEntryPath: 'pages/pwatest/index_entry',
        templateFileName: 'pwa',
    },
    {
        jsEntryPath: 'pages/yueba/index_entry',
        pageTitle: '饭蛋餐厅',
        templateFileName: 'pages/yueba/index',
        templateFileType: 'ejs',
        chunks:['pages/index/index_entry','pages/yueba/index_entry']
    },
];