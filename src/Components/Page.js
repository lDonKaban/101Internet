import { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { PROVIDERS_QUERY } from "../Queries/providersQuery";
import { TARIFFS_QUERY } from "../Queries/tariffsQuery";

const REGION_URL = "moskva";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  menuPaper: {
    maxHeight: 500,
  }
}));

const getColor = (arr) => arr.length > 1 ? 'blue' : 'green';
// const getBestCondition = (param) => {
//   let result
//   if (param === 'displayPrice') {
//     result = tariffsData.reduce((acc, tariff) => {
//       const value = tariff[param] || Infinity
//       if (acc.value < value) return acc
//       if (acc.value === value) {
//         acc.id.push(tariff.id)
//         return acc
//       }
//       return acc = {id: [tariff.id], value}
//     }, {id: [], value: Infinity})
//   } else {
//     result = tariffsData.reduce((acc, tariff) => {
//       const speed = param === 'speed_in' ? tariff.internet?.speed_in || 0
//       if (acc?.speed > speed) return acc
//       if (acc?.speed === speed) {
//         acc.id.push(tariff.id)
//         return acc
//       }
//       return acc = {id: [tariff.id], speed}
//     }, {id: [], speed: -1});
//   }
//   return result
// }
function Page() {
  const classes = useStyles();

  const [currentProvider, setCurrentProvider] = useState({});

  const providers = useQuery(PROVIDERS_QUERY, {
    variables: {
      filter: `region.url=${REGION_URL}`,
      limit: 200,
      offset: 0,
      sort: "name",
    },
  });
  const providersData = providers?.data?.providers?.data || [];

  const tariffs = useQuery(TARIFFS_QUERY, {
    skip: !currentProvider?.id,
    variables: {
      filter: `region.url=${REGION_URL}&provider.url_name=${currentProvider.url_name}`,
      limit: 100,
      offset: 0,
      sort: "name",
    },
  });
  const tariffsData = tariffs?.data?.tariffs?.data || [];
  const bestInternetSpeed = tariffsData.reduce((acc, tariff) => {
    const speed = tariff.internet?.speed_in || 0
    if (acc?.speed > speed) return acc
    if (acc?.speed === speed) {
      acc.id.push(tariff.id)
      return acc
    }
    return acc = {id: [tariff.id], speed}
  }, {id: [], speed: -1});

  bestInternetSpeed.color = getColor(bestInternetSpeed.id);

  const bestPrice = tariffsData.reduce((acc, tariff) => {
    const price = tariff.displayPrice || Infinity
    if (acc.price < price) return acc
    if (acc.price === price) {
      acc.id.push(tariff.id)
      return acc
    }
    return acc = {id: [tariff.id], price}
  }, {id: [], price: Infinity})

  bestPrice.color = getColor(bestPrice.id)

  const bestCountTV = tariffsData.reduce((acc, tariff) => {
    const countTV = tariff.tv?.channels || 0
    if (acc.count > countTV) return acc
    if (acc.count === countTV) {
      acc.id.push(tariff.id)
      return acc
    }
    return acc = {id: [tariff.id], count: countTV}
  }, {id: [], count: -1})

  bestCountTV.color = getColor(bestCountTV.id)

  const bestCountHDTV = tariffsData.reduce((acc, tariff) => {
    const countTV = tariff.tv?.channels_hd || 0
    if (acc.count > countTV) return acc
    if (acc.count === countTV) {
      acc.id.push(tariff.id)
      return acc
    }
    return acc = {id: [tariff.id], count: countTV}
  }, {id: [], count: -1})

  bestCountHDTV.color = getColor(bestCountHDTV.id)
  const handleChange = (event) => {
    const foundProvider = providersData.find(
      (x) => x.id === +event.target.value
    );
    if (foundProvider) {
      setCurrentProvider(foundProvider);
    }
  };

  const getAdvantage = (id) => {
    const advantages = []
    if (bestInternetSpeed.id.includes(id)) advantages.push('высокая скорость интернета')
    if (bestPrice.id.includes(id)) advantages.push('низкая цена')
    if (bestCountHDTV.id.includes(id)) advantages.push('большое количество HD-каналов')
    if (bestCountTV.id.includes(id)) advantages.push('большое количество телеканалов')
    return advantages.join(', ')
  }

  return (
    <Container>
      <Typography variant="h3" component="h2">
        Таблица сравнения
      </Typography>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="provider-select-label">Провайдер</InputLabel>
        <Select
          labelId="provider-select-label"
          id="provider-select"
          value={currentProvider?.id || 0}
          onChange={handleChange}
          label="Provider"
          MenuProps={{ classes: { paper: classes.menuPaper } }}
        >
          <MenuItem value="0">
            <em>None</em>
          </MenuItem>
          {providersData
            .filter((x) => x.info.cnt_tariffs > 0)
            .map((provider) => (
              <MenuItem key={provider.id} value={provider.id}>
                {provider.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название тарифа</TableCell>
              <TableCell>Скорость</TableCell>
              <TableCell>Количество телеканалов</TableCell>
              <TableCell>Количество HD-каналов</TableCell>
              <TableCell>Цена</TableCell>
              <TableCell>Преимущества</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tariffsData.map((tariff) => (
              <TableRow key={tariff.id}>
                <TableCell component="th" scope="row">
                  {tariff.name || '-'}
                </TableCell>
                <TableCell
                    component="th"
                    scope="row"
                    style={{backgroundColor: bestInternetSpeed.id?.includes(tariff.id) ? bestInternetSpeed.color : ''}}
                >
                  {tariff.internet?.speed_in || '-'}
                </TableCell>
                <TableCell
                    component="th"
                    scope="row"
                    style={{backgroundColor: bestCountTV.id?.includes(tariff.id) ? bestCountTV.color : ''}}
                >
                  {tariff.tv?.channels || '-'}
                </TableCell>
                <TableCell
                    component="th"
                    scope="row"
                    style={{backgroundColor: bestCountHDTV.id?.includes(tariff.id) ? bestCountHDTV.color : ''}}
                >
                  {tariff.tv?.channels_hd || '-'}
                </TableCell>
                <TableCell
                    component="th"
                    scope="row"
                    style={{backgroundColor: bestPrice.id?.includes(tariff.id) ? bestPrice.color : ''}}
                >
                  {tariff?.displayPrice || '-'}
                </TableCell>
                <TableCell
                    component="th"
                    scope="row"
                >
                  {getAdvantage(tariff.id)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Page;
