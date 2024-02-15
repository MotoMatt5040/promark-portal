from typing import Union

class Writer():

    def __init__(self):
        self._tnum = None
        self._qname = None
        self._title_text = None
        self._qtext = None
        self._rank = None
        self._qual = None
        self._base = None
        self._totals = None
        self._code_width = None
        self._start_column = None
        self._end_column = None
        self._column_text = None
        self._choice_codes = None
        self._max_choice = None
        self._choice_labels = None
        self._rows = None
        self._style = None

    def tnum(self):
        return f"TABLE {self._tnum}\n"

    def qname(self):
        return f"T {self._qname}:\n"

    def title_text(self):
        title_text = self._title_text
        return f"T {title_text}\n"

    def qtext(self):
        qtext = self._qtext

        if self._title_text is not None:
            return f"{self.title_text()}" \
                   f"T /\n" \
                   f"T {qtext}\n"
        return f"T {qtext}\n" \
               f"T \n" \
               f"T /\n"

    def rank(self):
        if self._rank:
            return "O RANK\n"
        return ""

    def qual(self):
        if self._qual is not None:
            return f"Q {self._qual}\n"
        else:
            return ""

    def base(self):
        if self._base is None:
            return "R BASE==TOTAL SAMPLE ;ALL ;HP NOVP\n"
        else:
            return f"R BASE=={self._base.replace('=', '==')} ;ALL ;HP NOVP\n"

    def row_style(self):
        if self._totals is None:
            return self.rows()
        if not self._style:
            return (
                f"{self.rows()}"
            )
        else:
            return self.rows_inline()

    def total_rows(self) -> Union[list, None]:
        totals = []
        if self._totals is None:
            return None
        keys = list(self._totals.keys())
        if keys[0] == "REPUBLICAN":
            totals.append(f"R *D//S ({keys[0]} - {keys[2]}) ;NONE ;EX (R3-R5)\n")  # NEEDS TO BE keys[2] IN SOME CASES
        else:
            totals.append(f"R *D//S ({keys[0]} - {keys[1]}) ;NONE ;EX (R3-R4)\n")

        index = 1
        for key in keys:
            if self._code_width > 1:
                totals.append(f"R &UT- TOTAL {key} ;{self._column_text}{self._totals[key][0]}:{self._totals[key][1]})")
            else:
                totals.append(f"R &UT- TOTAL {key} ;{self._column_text}-{self._totals[key][0]}:{self._totals[key][1]}")
            totals[index] += "\n"
            index += 1
        return totals

    def rows_list(self) -> list:
        row_text = []
        index = 0
        rows = []
        for row in self._rows:
            indent = ""
            if self._totals is not None:
                for j in self._totals:
                    if j in row:
                        if not "UNSURE" in row and not "NO OPINION" in row and not "NO ANSWER" in row:
                            indent = "&AI2 "
                        continue

            rows.append(f"R {indent}{row}\n")
            row_text.append(f"R {indent}{row}\n")
            index += 1
        if self._max_choice < 2:
            pos = 0
            append = 0
            not_choices = []
            for i in range(len(self._choice_codes)):
                if i < len(self._choice_codes) - 1:
                    try:
                        if int(self._choice_codes[i]) != int(self._choice_codes[i + 1]) - 1:
                            if int(self._choice_codes[i]) - int(self._choice_codes[i + 1]) < -1:
                                if append == 0:
                                    not_choices.append(f"{self._choice_codes[i]}")
                                else:
                                    not_choices.append(f",{self._choice_codes[i]}")
                            else:
                                not_choices.append(f":{self._choice_codes[i]}")
                            pos = i
                            append += 1
                    except:
                        pass
                elif i - pos > 1 and append > 0:
                    not_choices.append(f",{self._choice_codes[pos + 1]}:{self._choice_codes[i]}")
                elif append == 0:
                    not_choices.append(f"{self._choice_codes[0]}:{self._choice_codes[i]}")
                else:
                    not_choices.append(f",{self._choice_codes[i]}")

            if not not_choices == []:
                if self._code_width > 1:
                    rows.append(f"R NO ANSWER ;NOT{self._column_text}{not_choices[0]}) ;NOR SZR\n")

                else:
                    rows.append(f"R NO ANSWER ;{self._column_text}N{not_choices[0]} ;NOR SZR\n")
        return rows

    def rows_inline(self):
        if self._qname == 'QPARTYID':
            return self.rows()
        totals = self.total_rows()
        rows = self.rows_list()
        final_rows = rows[4:]
        return (
            f"{totals[0]}"  # This is the D//S score
            f"{totals[1]}"  # This is the first total header
            f"{rows[0]}"  # Indented row info
            f"{rows[1]}"  # Indented row info
            f"{totals[2]}"  # This is the second total header
            f"{rows[2]}"  # Indented row info
            f"{rows[3]}"  # Indented row info
            + ''.join(final_rows)  # rows after total included rows, non-indented
        )

    def rows(self):
        rows = ""
        if self._totals is not None:
            for row in self.total_rows():
                rows += row
        for row in self.rows_list():
            rows += row
        return rows

    """-----------------------------------------------Create--------------------------------------------------"""

    def create_table(self) -> str:
        table = f"*\n" \
                f"{self.tnum()}" \
                f"{self.qname()}" \
                f"{self.qtext()}" \
                f"{self.rank()}{self.qual()}{self.base()}" \
                f"{self.row_style()}"
        return table

    """-----------------------------------------------Create--------------------------------------------------"""

    def set_tnum(self, tnum: int):
        self._tnum = tnum

    def set_qname(self, qname: str):
        self._qname = qname

    def set_title_text(self, title_text: str):
        if title_text != "":
            self._title_text = title_text
        else:
            self._title_text = None

    def set_qtext(self, qtext: str):
        self._qtext = qtext

    def set_rank(self, rank: bool):
        self._rank = rank

    def set_qual(self, qual):
        self._qual = qual

    def set_base(self, base: str):
        self._base = base

    def set_totals(self, totals: dict[str: list[int]]):
        self._totals = totals

    def set_code_width(self, code_width: int):
        self._code_width = code_width

    def set_start_column(self, start_column):
        self._start_column = start_column

    def set_end_column(self, end_column):
        self._end_column = end_column

    def set_column_text(self):
        if self._code_width > 1:
            self._column_text = f"R({self._start_column}:{self._end_column},"
        else:
            self._column_text = f"{self._start_column}"

    def set_choice_codes(self, choice_codes: Union[int, list[int]]):
        if type(choice_codes) == int:
            self._choice_codes = [choice_codes]
        else:
            self._choice_codes = choice_codes

    def set_max_choice(self, max_choice: int):
        self._max_choice = max_choice

    def set_choice_labels(self, choice_labels: list[str]):
        self._choice_labels = choice_labels

    def set_rows(self, rows: list[str]):
        self._rows = rows

    def set_style(self, style: bool):
        self._style = style

    """--------------------------------------------------GET--------------------------------------------------"""

    def get_tnum(self) -> int:
        return self._tnum

    def get_qname(self) -> str:
        return self._qname

    def get_title_text(self) -> str:
        return self._title_text

    def get_qtext(self) -> str:
        return self._qtext

    def get_rank(self) -> bool:
        return self._rank

    def get_qual(self) -> str:
        return self._qual

    def get_base(self) -> str:
        return self._base

    def get_code_width(self) -> int:
        return self._code_width

    def get_start_column(self) -> int:
        return self._start_column

    def get_end_column(self) -> int:
        return self._end_column

    def get_column_text(self) -> str:
        return self._column_text

    def get_choice_codes(self) -> list[int]:
        return self._choice_codes

    def get_choice_labels(self) -> list[str]:
        return self._choice_labels

    def get_max_choice(self) -> int:
        return self._max_choice

    def get_rows(self) -> list[str]:
        return self._rows

    def get_totals(self) -> list[str]:
        return self._totals.keys()

    def get_styles(self) -> bool:
        return self._style
