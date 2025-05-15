import React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Box } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';

import zeptoProducts from './data/zeptoProductDetails.json';
import blinkitProducts from './data/blinkitProductDetails.json';
import flipkartProducts from './data/flipkartProductDetails.json';
import instamartProducts from './data/instamartProductDetails.json';

const App = () => {
  const [platform, setPlatform] = React.useState('Zepto');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterCategory, setFilterCategory] = React.useState('All');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [discountRange, setDiscountRange] = React.useState('All');

  const getDataByPlatform = () => {
    switch (platform) {
      case 'Zepto':
        return zeptoProducts;
      case 'Blinkit':
        return blinkitProducts;
      case 'Flipkart':
        return flipkartProducts;
      case 'Instamart':
        return instamartProducts;
      default:
        return [];
    }
  };
  // Normalize data
  const normalizedData = getDataByPlatform().map((item) => ({
    productImage: item.productImage || item.image,
    productName: item.productName || item.name,
    discountPercentage: item.discountPercentage,
    discountedPrice: item.discountedPrice,
    orignalPrice: item.orignalPrice || item.originalPrice,
    categoryName: item.categoryName || 'Others',
    scrappedDate: item.scrappedDate || item.lastScrapDate,
    link: item.link || item.productLink || '#',
  }));


  const categories = ['All', ...new Set(normalizedData.map(item => item.categoryName))];

  const filteredData = normalizedData.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.categoryName === filterCategory;

    let matchesDiscount = true;
    if (discountRange !== 'All') {
      const [min, max] = discountRange.split('-').map(Number);
      const discount = parseFloat(item.discountPercentage?.replace('%', '')) || 0;
      matchesDiscount = discount >= min && discount < max;
    }

    return matchesSearch && matchesCategory && matchesDiscount;
  });

  React.useEffect(() => {
    setPage(0);
  }, [searchTerm, platform, filterCategory, discountRange]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const lastScrapDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString();

  return (
    <Box sx={{ p: 4 }}>
      {/* Search and Filter */}
      <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', mb: 4 }}>
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300 }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Product"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IconButton type="button" sx={{ p: '10px' }}>
            <SearchIcon />
          </IconButton>
        </Paper>

        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Platform</InputLabel>
          <Select
            value={platform}
            label="Platform"
            onChange={(e) => {
              setPlatform(e.target.value);
              setFilterCategory('All'); // Reset category when switching platform
            }}
          >
            <MenuItem value="Zepto">Zepto</MenuItem>
            <MenuItem value="Blinkit">Blinkit</MenuItem>
            <MenuItem value="Flipkart">Flipkart</MenuItem>
            <MenuItem value="Instamart">Instamart</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Discount %</InputLabel>
          <Select
            value={discountRange}
            label="Discount %"
            onChange={(e) => setDiscountRange(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="50-60">50–60%</MenuItem>
            <MenuItem value="60-70">60–70%</MenuItem>
            <MenuItem value="70-80">70–80%</MenuItem>
            <MenuItem value="80-90">80–90%</MenuItem>
            <MenuItem value="90-100">90–100%</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Category / Brand</InputLabel>
          <Select
            value={filterCategory}
            label="Category / Brand"
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map((cat, idx) => (
              <MenuItem key={idx} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Original Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Last Scrap Date</TableCell>
              <TableCell>Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <img
                      src={product.productImage}
                      alt={product.productName}
                      style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                    />
                  </TableCell>
                  <TableCell>{product.productName.slice(0, 50)}</TableCell>
                  <TableCell>{product.discountPercentage}</TableCell>
                  <TableCell>{product.discountedPrice}</TableCell>
                  <TableCell>{product.orignalPrice}</TableCell>
                  <TableCell>{product.categoryName}</TableCell>
                  <TableCell>{product.scrappedDate ? new Date(product.scrappedDate).toLocaleDateString() : lastScrapDate}</TableCell>
                  {product.link !=='#' ? (
                    <TableCell>
                      <a href={product.link} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </TableCell>
                  ) : (
                    <TableCell>
                      <span style={{ color: 'red' }}>No Link</span>
                    </TableCell>
                  )}
                  
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Box>
  );
};

export default App;
