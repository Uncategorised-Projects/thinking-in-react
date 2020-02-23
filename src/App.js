import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';

const groupBy = function (arr, criteria) {
    return arr.reduce((obj, item) => {
        const key = typeof criteria === 'function' ? criteria(item) : item[criteria];
        if (!obj.hasOwnProperty(key)) {
            obj[key] = [];
        }
        obj[key].push(item);
        return obj;
    }, {});
};

const jsonData = [
    {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
    {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
    {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
    {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
    {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
    {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];

const useStyles = makeStyles({
    center: {
        width: 250,
        margin: "8px auto",
    },
    table: {
        tableLayout: `fixed`,
    },
    th: {
        textAlign: `left`,
    },
    td: {
        textAlign: `left`,
    },
    productName: {
        color: stocked => !stocked ? `red` : null
    },
});

function App() {
    return <FilterableProductTable productList={groupBy(jsonData, 'category')}/>;
}

function FilterableProductTable({productList}) {
    const [filterSearch, setFilterSearch] = useState("");
    const [filterOnlyInStock, setFilterOnlyInStock] = useState(false);
    const classes = useStyles();

    return (
        <div className={classes.center}>
            <SearchBar
                filterSearch={filterSearch}
                setFilterSearch={setFilterSearch}
                filterOnlyInStock={filterOnlyInStock}
                setFilterOnlyInStock={setFilterOnlyInStock}
            />
            <ProductTable
                productList={productList}
                filterSearch={filterSearch}
                filterOnlyInStock={filterOnlyInStock}
            />
        </div>
    )
}

function SearchBar({filterSearch, setFilterSearch, filterOnlyInStock, setFilterOnlyInStock}) {
    return (
        <form>
            <input type="search" placeholder="Search..." value={filterSearch}
                   onChange={e => setFilterSearch(e.target.value)}/>
            <br/>
            <label>
                <input type="checkbox" checked={filterOnlyInStock}
                       onChange={e => setFilterOnlyInStock(e.target.checked)}/>
                {" Only show products in stock"}
            </label>
        </form>
    )
}

function ProductTable({productList, filterSearch, filterOnlyInStock}) {
    const classes = useStyles();

    const filteredProducts = Object.keys(productList).map((key) => {
        const currentTypeProductList = productList[key];
        return [
            <ProductCategoryRow
                key={currentTypeProductList[0].category}
                category={currentTypeProductList[0].category}
            />,
            currentTypeProductList
                .filter(product => product.name.toLowerCase().includes(filterSearch.toLowerCase()))
                .filter(product => !filterOnlyInStock ? true : product.stocked === true)
                .map(product =>
                    <ProductRow
                        key={product.name}
                        name={product.name}
                        price={product.price}
                        stocked={product.stocked}
                    />
                )
        ]
    });

    return (
        <table className={classes.table}>
            <thead>
            <tr>
                <th className={classes.th}>Name</th>
                <th className={classes.th}>Price</th>
            </tr>
            </thead>
            <tbody>
            {filteredProducts}
            </tbody>
        </table>
    )
}

function ProductCategoryRow({category}) {
    const classes = useStyles();

    return (
        <tr>
            <th className={classes.th} colSpan={2}>{category}</th>
        </tr>
    )
}

function ProductRow({name, price, stocked}) {
    const classes = useStyles(stocked);

    return (
        <tr>
            <td className={`${classes.td} ${classes.productName}`}>{name}</td>
            <td className={classes.td}>{price}</td>
        </tr>
    )
}


export default App;
