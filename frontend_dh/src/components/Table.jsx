import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(srNo, name, subjectScore) {
  return { srNo, name, subjectScore };
}

const rows = [
  createData(1, "...", "..."),
  createData(2, "...", "..."),
  createData(3, "...", "..."),
  createData(4, "...", "..."),
  createData(5, "...", "..."),
  createData(132, "your name", 58), // Current user's data
];

export default function BasicTable() {
  const currentUser = rows.find((row) => row.name === "your name"); // Find current user
  const top5 = rows.slice(0, 5); // Get the top 5 rows

  const isCurrentUserInTop5 = top5.some((row) => row.name === currentUser.name);
    
  const rowsToDisplay = isCurrentUserInTop5 ? top5 : rows;



  return (
    <div className="p-16 m-16">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Sr No.</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Subject Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsToDisplay.map((row) => ( // Map over rowsToDisplay
              <TableRow
                key={row.srNo}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.srNo}
                </TableCell>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">{row.subjectScore}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}